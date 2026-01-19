'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const DrivingBlindAdmin = () => {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);

    const [makes, setMakes] = useState([]);
    const [models, setModels] = useState([]);
    const [selectedMakeId, setSelectedMakeId] = useState('');
    const [selectedModelId, setSelectedModelId] = useState('');

    const [formData, setFormData] = useState({
        date: '',
        make: '',
        model: '',
        year: '',
    });

    useEffect(() => {
        fetchCars();
        fetchMakes();
    }, []);

    // When Make changes, fetch relevant models
    useEffect(() => {
        if (selectedMakeId) {
            fetchModels(selectedMakeId);
        } else {
            setModels([]);
        }
    }, [selectedMakeId]);

    const fetchCars = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('driving_blind')
                .select(`
                    *,
                    make:makes(id, name),
                    model:models(id, name)
                `)
                .order('date', { ascending: false });

            if (error) throw error;
            setCars(data || []);
        } catch (error) {
            console.error('Error fetching driving blind cars:', error);
            // Fallback for debugging if join fails
            alert('Error loading cars. Check console.');
        } finally {
            setLoading(false);
        }
    };

    const fetchMakes = async () => {
        try {
            const { data, error } = await supabase
                .from('makes')
                .select('*')
                .order('name', { ascending: true });

            if (error) throw error;
            setMakes(data || []);
        } catch (error) {
            console.error('Error fetching makes:', error);
        }
    };

    const fetchModels = async (makeId) => {
        try {
            const { data, error } = await supabase
                .from('models')
                .select('*')
                .eq('make_id', makeId)
                .order('name', { ascending: true });

            if (error) throw error;
            setModels(data || []);
            return data || [];
        } catch (error) {
            console.error('Error fetching models:', error);
            return [];
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                date: formData.date,
                make_id: parseInt(selectedMakeId),
                model_id: parseInt(selectedModelId),
                year: parseInt(formData.year),
            };

            let error;
            if (isEditing) {
                const { error: updateError } = await supabase
                    .from('driving_blind')
                    .update(payload)
                    .eq('id', isEditing);
                error = updateError;
            } else {
                const { error: insertError } = await supabase
                    .from('driving_blind')
                    .insert([payload]);
                error = insertError;
            }

            if (error) throw error;

            fetchCars();
            resetForm();
            setShowAddForm(false);
        } catch (error) {
            console.error('Error saving car:', error);
            alert('Failed to save car');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this car?")) return;
        try {
            const { error } = await supabase
                .from('driving_blind')
                .delete()
                .eq('id', id);

            if (error) throw error;
            fetchCars();
        } catch (error) {
            console.error('Error deleting car:', error);
            alert('Failed to delete car');
        }
    };

    const startEdit = async (car) => {
        setIsEditing(car.id);

        // Use ID directly if available from join (car.make.id)
        // car.make might be an object now due to the join
        let makeId = car.make_id || (car.make && car.make.id);
        let modelId = car.model_id || (car.model && car.model.id);

        setFormData({
            date: car.date,
            year: car.year,
        });

        if (makeId) {
            setSelectedMakeId(makeId);
            // Fetch models immediately
            await fetchModels(makeId);
            if (modelId) {
                setSelectedModelId(modelId);
            }
        } else {
            setSelectedMakeId('');
            setSelectedModelId('');
            setModels([]);
        }

        setShowAddForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const resetForm = () => {
        setFormData({
            date: '',
            year: '',
        });
        setSelectedMakeId('');
        setSelectedModelId('');
        setModels([]);
        setIsEditing(null);
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <button
                    onClick={() => {
                        setShowAddForm(!showAddForm);
                        if (!showAddForm) resetForm();
                    }}
                    style={styles.addButton}
                >
                    {showAddForm ? 'Cancel' : '+ Add New Car'}
                </button>
            </div>

            {showAddForm && (
                <form onSubmit={handleSave} style={styles.form}>
                    <div style={styles.formRow}>
                        <div style={styles.field}>
                            <label style={styles.label}>Game Date:</label>
                            <input
                                type="date"
                                value={formData.date}
                                onChange={e => setFormData({ ...formData, date: e.target.value })}
                                required
                                style={styles.input}
                            />
                        </div>
                        <div style={styles.field}>
                            <label style={styles.label}>Year:</label>
                            <input
                                type="number"
                                value={formData.year}
                                onChange={e => setFormData({ ...formData, year: e.target.value })}
                                required
                                style={styles.input}
                            />
                        </div>
                    </div>
                    <div style={styles.formRow}>
                        <div style={styles.field}>
                            <label style={styles.label}>Make:</label>
                            <select
                                value={selectedMakeId}
                                onChange={e => {
                                    const makeId = e.target.value;
                                    setSelectedMakeId(makeId);
                                    setSelectedModelId(''); // Reset model
                                }}
                                required
                                style={styles.input}
                            >
                                <option value="">Select Make</option>
                                {makes.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                            </select>
                        </div>
                        <div style={styles.field}>
                            <label style={styles.label}>Model:</label>
                            <select
                                value={selectedModelId}
                                onChange={e => {
                                    const modelId = e.target.value;
                                    setSelectedModelId(modelId);
                                }}
                                required
                                style={styles.input}
                                disabled={!selectedMakeId}
                            >
                                <option value="">Select Model</option>
                                {models.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                            </select>
                        </div>
                    </div>

                    <div style={styles.formActions}>
                        <button type="submit" style={styles.saveButton}>
                            {isEditing ? 'Update Car' : 'Add Car'}
                        </button>
                    </div>
                </form>
            )}

            <div style={styles.list}>
                {loading ? (
                    <p>Loading...</p>
                ) : cars.length === 0 ? (
                    <p>No cars found.</p>
                ) : (
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>Date</th>
                                <th style={styles.th}>Year</th>
                                <th style={styles.th}>Make</th>
                                <th style={styles.th}>Model</th>
                                <th style={styles.th}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cars.map(car => (
                                <tr key={car.id} style={styles.tr}>
                                    <td style={styles.td}>{car.date}</td>
                                    <td style={styles.td}>{car.year}</td>
                                    <td style={styles.td}>{car.make?.name || 'Unknown'}</td>
                                    <td style={styles.td}>{car.model?.name || 'Unknown'}</td>
                                    <td style={styles.td}>
                                        <button onClick={() => startEdit(car)} style={styles.editButton}>Edit</button>
                                        <button onClick={() => handleDelete(car.id)} style={styles.deleteButton}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

const styles = {
    container: {
        color: '#fff',
        padding: '20px',
        maxWidth: '800px',
        margin: '0 auto'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
    },
    addButton: {
        padding: '10px 20px',
        backgroundColor: '#a3f7bf',
        color: '#1a1a2e',
        border: 'none',
        borderRadius: '10px',
        fontWeight: 'bold',
        cursor: 'pointer'
    },
    form: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        padding: '20px',
        borderRadius: '10px',
        marginBottom: '30px',
        display: 'flex',
        flexDirection: 'column',
        gap: '15px'
    },
    formRow: {
        display: 'flex',
        gap: '20px'
    },
    field: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '5px'
    },
    label: {
        fontSize: '0.9rem',
        color: '#000'
    },
    input: {
        padding: '10px',
        backgroundColor: 'rgba(0,0,0,0.3)',
        border: '1px solid #444',
        borderRadius: '10px',
        color: '#fff',
        fontSize: '1rem'
    },
    formActions: {
        display: 'flex',
        justifyContent: 'flex-end',
        marginTop: '10px'
    },
    saveButton: {
        padding: '10px 20px',
        backgroundColor: '#2563EB',
        color: '#fff',
        border: 'none',
        borderRadius: '10px',
        fontWeight: 'bold',
        cursor: 'pointer'
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: '10px',
        overflow: 'hidden'
    },
    th: {
        textAlign: 'left',
        padding: '12px',
        backgroundColor: 'rgba(0,0,0,0.4)',
        borderBottom: '1px solid #444'
    },
    tr: {
        borderBottom: '1px solid #333'
    },
    td: {
        padding: '12px',
        color: '#000',
        verticalAlign: 'middle'
    },
    link: {
        color: '#4285F4',
        textDecoration: 'none'
    },
    editButton: {
        padding: '5px 10px',
        backgroundColor: '#F59E0B',
        color: '#fff',
        border: 'none',
        borderRadius: '10px',
        marginRight: '10px',
        cursor: 'pointer'
    },
    deleteButton: {
        padding: '5px 10px',
        backgroundColor: '#EF4444',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer'
    }
};

export default DrivingBlindAdmin;
