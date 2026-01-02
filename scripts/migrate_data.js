const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://bsvbxevkmqltxhicrjem.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_KEY) {
    console.error("Error: SUPABASE_SERVICE_ROLE_KEY environment variable is required.");
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const dailyCarsPath = path.join(__dirname, '../src/data/dailyCars.json');
const carsMasterPath = path.join(__dirname, '../src/data/cars.json');

const dailyCars = JSON.parse(fs.readFileSync(dailyCarsPath, 'utf8'));
const carsMaster = JSON.parse(fs.readFileSync(carsMasterPath, 'utf8'));

async function migrate() {
    console.log('Starting comprehensive migration (Phase 2)...');

    // 1. Cleanup: Delete existing data to start fresh
    // Note: Deleting makes/models will cascade delete daily_games/user_scores due to foreign keys if configured,
    // but we'll do it explicitly to be safe.
    console.log('Cleaning up old data...');
    await supabase.from('user_scores').delete().neq('id', 0);
    await supabase.from('daily_games').delete().neq('id', 0);
    await supabase.from('models').delete().neq('id', 0);
    await supabase.from('makes').delete().neq('id', 0);
    console.log('Cleanup complete.');

    // 2. Import Master Makes and Models
    console.log('Importing master vehicle data...');
    const makeNameIdMap = {}; // "normalized_make_name" -> db_id
    const modelNameIdMap = {}; // "normalized_make_name:normalized_model_name" -> db_id

    for (const makeEntry of carsMaster.makes) {
        const makeName = makeEntry.make.trim();

        // Insert Make
        const { data: makeData, error: makeError } = await supabase
            .from('makes')
            .insert({ name: makeName }) // Letting DB assign new ID, or we could use makeEntry.id? Let's let DB assign to avoid conflicts if any, unless we want strict mapping.
            // Actually, preserving relationships is easier if we just trust the DB IDs we generate now.
            .select()
            .single();

        if (makeError) {
            console.error(`Error inserting make ${makeName}:`, makeError);
            continue;
        }

        const makeId = makeData.id;
        makeNameIdMap[makeName.toLowerCase()] = makeId;
        process.stdout.write(`M`);

        // Insert Models for this Make
        if (makeEntry.models && makeEntry.models.length > 0) {
            const modelsToInsert = makeEntry.models.map(m => ({
                make_id: makeId,
                name: m.model.trim()
            }));

            const { data: modelData, error: modelError } = await supabase
                .from('models')
                .insert(modelsToInsert)
                .select();

            if (modelError) {
                console.error(`Error inserting models for ${makeName}:`, modelError);
            } else {
                modelData.forEach(m => {
                    modelNameIdMap[`${makeName.toLowerCase()}:${m.name.toLowerCase()}`] = m.id;
                });
            }
        }
    }
    console.log('\nMaster vehicle data imported.');

    // 3. Import Daily Games (Lookup IDs)
    console.log(`Importing ${dailyCars.length} daily games...`);

    for (const car of dailyCars) {
        const makeName = car.make.trim();
        const modelName = car.model.trim();

        const makeKey = makeName.toLowerCase();
        const modelKey = `${makeKey}:${modelName.toLowerCase()}`;

        // Try exact match first
        let makeId = makeNameIdMap[makeKey];
        let modelId = modelNameIdMap[modelKey];

        // Fallback: If model not found, try to find it under this make (maybe slightly different casing/spacing, though we normalized)
        // If still not found, we might need to insert it on the fly? 
        // User said: "Unfortunately, those keys are only created and looked up via text matching but they need to be inserted into the daily_games table using the corresponding id once the text is matched."
        // Implication: If it's in dailyCars but NOT in cars.json, we have a problem.
        // Let's assume for now we skip or log error. OR we insert the missing model?
        // Let's log error for now, because cars.json should be the source of truth.

        if (!makeId) {
            console.error(`UNKNOWN MAKE in dailyCars: ${makeName}`);
            continue;
        }

        if (!modelId) {
            // Flexible matching? Search the models for this make in the map
            // For now, log error.
            console.error(`UNKNOWN MODEL in dailyCars: ${modelName} (Make: ${makeName})`);

            // OPTIONAL: Insert it if missing?
            // Uncomment below to auto-fix missing models
            /*
            const { data: newModel } = await supabase.from('models').insert({ make_id: makeId, name: modelName }).select().single();
            modelId = newModel.id;
            modelNameIdMap[modelKey] = modelId;
            console.log(`-> Created missing model: ${modelName}`);
            */
            continue;
        }

        const gamePayload = {
            date: car.date,
            make_id: makeId,
            model_id: modelId,
            year: car.year,
            image_url: car.imageUrl,
            game_over_image_url: car.gameOverImageURL || null,
            transform_origin: car.transformOrigin,
            max_zoom: car.maxZoom
        };

        const { error } = await supabase
            .from('daily_games')
            .insert(gamePayload);

        if (error) {
            console.error(`Error inserting game for date ${car.date}:`, error);
        } else {
            process.stdout.write('G');
        }
    }
    console.log('\nMigration complete!');
}

migrate();
