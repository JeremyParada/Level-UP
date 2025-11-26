import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import DireccionForm from './DireccionForm';
import fetchWithAuth from '../utils/api';
import { useNotification } from '../hooks/useNotification';

const DireccionesManager = ({ idUsuario }) => {
    const { exito, error: notifError } = useNotification();
    const [direcciones, setDirecciones] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [modoEdicion, setModoEdicion] = useState(false);
    const [direccionActual, setDireccionActual] = useState(null);
    const [cargando, setCargando] = useState(false);

    const [formData, setFormData] = useState({
        calle: '',
        numero: '',
        comuna: '',
        ciudad: '',
        region: '',
        codigoPostal: '',
        tipoDireccion: 'Casa',
        esPrincipal: 0
    });

    // Cargar direcciones del usuario
    const cargarDirecciones = async () => {
        try {
            setCargando(true);
            const response = await fetchWithAuth(`/v1/direcciones/usuario/${idUsuario}`);
            if (response.ok) {
                const data = await response.json();
                setDirecciones(data);
            }
        } catch (err) {
            console.error('Error al cargar direcciones:', err);
        } finally {
            setCargando(false);
        }
    };

    // Cargar direcciones al montar el componente
    React.useEffect(() => {
        if (idUsuario) {
            cargarDirecciones();
        }
    }, [idUsuario]);

    const handleChange = (e) => {
        const { id, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [id]: type === 'checkbox' ? (checked ? 1 : 0) : value
        });
    };

    const abrirModalNueva = () => {
        setModoEdicion(false);
        setDireccionActual(null);
        setFormData({
            calle: '',
            numero: '',
            comuna: '',
            ciudad: '',
            region: '',
            codigoPostal: '',
            tipoDireccion: 'Casa',
            esPrincipal: 0
        });
        setShowModal(true);
    };

    const abrirModalEditar = (direccion) => {
        setModoEdicion(true);
        setDireccionActual(direccion);
        setFormData({
            calle: direccion.calle || '',
            numero: direccion.numero || '',
            comuna: direccion.comuna || '',
            ciudad: direccion.ciudad || '',
            region: direccion.region || '',
            codigoPostal: direccion.codigoPostal || '',
            tipoDireccion: direccion.tipoDireccion || 'Casa',
            esPrincipal: direccion.esPrincipal || 0
        });
        setShowModal(true);
    };

    const cerrarModal = () => {
        setShowModal(false);
        setModoEdicion(false);
        setDireccionActual(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const payload = {
                ...formData,
                usuario: { idUsuario: idUsuario }
            };

            let response;
            if (modoEdicion && direccionActual) {
                // Actualizar dirección existente
                response = await fetchWithAuth(`/v1/direcciones/${direccionActual.idDireccion}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });
            } else {
                // Crear nueva dirección
                response = await fetchWithAuth('/v1/direcciones', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
            }

            if (response.ok) {
                exito(modoEdicion ? '✅ Dirección actualizada' : '✅ Dirección agregada');
                cerrarModal();
                cargarDirecciones();
            } else {
                notifError('❌ Error al guardar la dirección');
            }
        } catch (err) {
            console.error('Error al guardar dirección:', err);
            notifError('❌ Error al guardar la dirección');
        }
    };

    const handleEliminar = async (idDireccion) => {
        if (!window.confirm('¿Estás seguro de que deseas eliminar esta dirección?')) {
            return;
        }

        try {
            const response = await fetchWithAuth(`/v1/direcciones/${idDireccion}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                exito('✅ Dirección eliminada');
                cargarDirecciones();
            } else {
                notifError('❌ Error al eliminar la dirección');
            }
        } catch (err) {
            console.error('Error al eliminar dirección:', err);
            notifError('❌ Error al eliminar la dirección');
        }
    };

    return (
        <div className="card card-formulario rounded-4 p-4 mb-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="texto-principal color-acento-azul mb-0">
                    📍 Mis Direcciones
                </h3>
                <button className="btn btn-registrarse btn-sm" onClick={abrirModalNueva}>
                    + Agregar Dirección
                </button>
            </div>

            {cargando ? (
                <div className="text-center py-4">
                    <div className="spinner-border color-acento-azul" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                </div>
            ) : direcciones.length === 0 ? (
                <div className="text-center py-4">
                    <p className="text-muted mb-3">No tienes direcciones guardadas</p>
                    <button className="btn btn-registrarse" onClick={abrirModalNueva}>
                        Agregar primera dirección
                    </button>
                </div>
            ) : (
                <div className="row">
                    {direcciones.map((direccion) => (
                        <div key={direccion.idDireccion} className="col-md-6 mb-3">
                            <div className="card h-100 border">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                        <h6 className="color-acento-azul mb-0">
                                            {direccion.tipoDireccion || 'Dirección'}
                                            {direccion.esPrincipal === 1 && (
                                                <span className="badge bg-success ms-2">Principal</span>
                                            )}
                                        </h6>
                                    </div>
                                    <p className="mb-1">
                                        <strong>{direccion.calle} {direccion.numero}</strong>
                                    </p>
                                    <p className="mb-1 text-muted small">
                                        {direccion.comuna}, {direccion.ciudad}
                                    </p>
                                    <p className="mb-3 text-muted small">
                                        {direccion.region}
                                        {direccion.codigoPostal && ` - ${direccion.codigoPostal}`}
                                    </p>
                                    <div className="d-flex gap-2">
                                        <button
                                            className="btn btn-outline-primary btn-sm"
                                            onClick={() => abrirModalEditar(direccion)}
                                        >
                                            ✏️ Editar
                                        </button>
                                        <button
                                            className="btn btn-outline-danger btn-sm"
                                            onClick={() => handleEliminar(direccion.idDireccion)}
                                        >
                                            🗑️ Eliminar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal para agregar/editar dirección */}
            <Modal show={showModal} onHide={cerrarModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {modoEdicion ? 'Editar Dirección' : 'Nueva Dirección'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="tipoDireccion">
                            <Form.Label>Tipo de Dirección</Form.Label>
                            <Form.Select value={formData.tipoDireccion} onChange={handleChange}>
                                <option value="Casa">Casa</option>
                                <option value="Trabajo">Trabajo</option>
                                <option value="Otro">Otro</option>
                            </Form.Select>
                        </Form.Group>

                        <DireccionForm formData={formData} handleChange={handleChange} />

                        <Form.Group className="mb-3" controlId="esPrincipal">
                            <Form.Check
                                type="checkbox"
                                label="Establecer como dirección principal"
                                checked={formData.esPrincipal === 1}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <div className="d-flex gap-2 justify-content-end">
                            <Button variant="secondary" onClick={cerrarModal}>
                                Cancelar
                            </Button>
                            <Button variant="primary" type="submit">
                                {modoEdicion ? 'Actualizar' : 'Guardar'}
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default DireccionesManager;
