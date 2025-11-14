import React from 'react';
import { Form } from 'react-bootstrap';

const DireccionForm = ({ formData, handleChange }) => {
  return (
    <>
      <Form.Group className="mb-3" controlId="calle">
        <Form.Label>Calle</Form.Label>
        <Form.Control
          required
          type="text"
          placeholder="Ej: Av. Siempre Viva"
          value={formData.calle}
          onChange={handleChange}
        />
        <Form.Control.Feedback type="invalid">
          Debes ingresar una calle.
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3" controlId="numero">
        <Form.Label>Número</Form.Label>
        <Form.Control
          required
          type="text"
          placeholder="Ej: 742"
          value={formData.numero}
          onChange={handleChange}
        />
        <Form.Control.Feedback type="invalid">
          Debes ingresar un número.
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3" controlId="comuna">
        <Form.Label>Comuna</Form.Label>
        <Form.Control
          required
          type="text"
          placeholder="Ej: Springfield"
          value={formData.comuna}
          onChange={handleChange}
        />
        <Form.Control.Feedback type="invalid">
          Debes ingresar una comuna.
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3" controlId="ciudad">
        <Form.Label>Ciudad</Form.Label>
        <Form.Control
          required
          type="text"
          placeholder="Ej: Springfield"
          value={formData.ciudad}
          onChange={handleChange}
        />
        <Form.Control.Feedback type="invalid">
          Debes ingresar una ciudad.
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3" controlId="region">
        <Form.Label>Región</Form.Label>
        <Form.Control
          required
          type="text"
          placeholder="Ej: Región Metropolitana"
          value={formData.region}
          onChange={handleChange}
        />
        <Form.Control.Feedback type="invalid">
          Debes ingresar una región.
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3" controlId="codigoPostal">
        <Form.Label>Código Postal</Form.Label>
        <Form.Control
          type="text"
          placeholder="Ej: 1234567"
          value={formData.codigoPostal}
          onChange={handleChange}
        />
      </Form.Group>
    </>
  );
};

export default DireccionForm;