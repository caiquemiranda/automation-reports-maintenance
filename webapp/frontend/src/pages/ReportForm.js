import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

// Esquema de validação do formulário
const ReportSchema = Yup.object().shape({
    equipment: Yup.string().required('Nome do equipamento é obrigatório'),
    date: Yup.string().required('Data é obrigatória'),
    technician: Yup.string().required('Nome do técnico é obrigatório'),
    service_description: Yup.string().required('Descrição do serviço é obrigatória'),
    parts_used: Yup.array().of(
        Yup.object().shape({
            name: Yup.string().required('Nome da peça é obrigatório'),
            quantity: Yup.number().required('Quantidade é obrigatória').positive('Deve ser um número positivo'),
            notes: Yup.string()
        })
    ),
    observations: Yup.string()
});

const ReportForm = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.post('/api/generate-report', values, {
                responseType: 'blob' // Importante para receber o arquivo
            });

            // Criar URL para o blob
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;

            // Definir o nome do arquivo
            const contentDisposition = response.headers['content-disposition'];
            let filename = 'relatorio.docx';

            if (contentDisposition) {
                const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
                if (filenameMatch && filenameMatch[1]) {
                    filename = filenameMatch[1].replace(/['"]/g, '');
                }
            }

            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Resetar formulário
            resetForm();

        } catch (err) {
            console.error('Erro ao gerar relatório:', err);
            setError('Ocorreu um erro ao gerar o relatório. Por favor, tente novamente.');
        } finally {
            setLoading(false);
            setSubmitting(false);
        }
    };

    return (
        <div className="form-container">
            <h1>Novo Relatório de Manutenção</h1>

            {error && <div className="error-message">{error}</div>}

            <Formik
                initialValues={{
                    equipment: '',
                    date: new Date().toISOString().split('T')[0], // Data atual no formato YYYY-MM-DD
                    technician: '',
                    service_description: '',
                    parts_used: [{ name: '', quantity: 1, notes: '' }],
                    observations: ''
                }}
                validationSchema={ReportSchema}
                onSubmit={handleSubmit}
            >
                {({ values, isSubmitting, errors, touched }) => (
                    <Form>
                        <div className="form-group">
                            <label htmlFor="equipment">Equipamento</label>
                            <Field type="text" name="equipment" className="form-control" />
                            <ErrorMessage name="equipment" component="div" className="error-message" />
                        </div>

                        <div className="form-group">
                            <label htmlFor="date">Data</label>
                            <Field type="date" name="date" className="form-control" />
                            <ErrorMessage name="date" component="div" className="error-message" />
                        </div>

                        <div className="form-group">
                            <label htmlFor="technician">Técnico</label>
                            <Field type="text" name="technician" className="form-control" />
                            <ErrorMessage name="technician" component="div" className="error-message" />
                        </div>

                        <div className="form-group">
                            <label htmlFor="service_description">Descrição do Serviço</label>
                            <Field as="textarea" name="service_description" className="form-control" rows="4" />
                            <ErrorMessage name="service_description" component="div" className="error-message" />
                        </div>

                        <div className="form-group">
                            <label>Peças Utilizadas</label>
                            <FieldArray name="parts_used">
                                {({ remove, push }) => (
                                    <div>
                                        {values.parts_used.length > 0 &&
                                            values.parts_used.map((part, index) => (
                                                <div key={index} style={{ display: 'flex', marginBottom: '10px', gap: '10px' }}>
                                                    <div style={{ flex: 3 }}>
                                                        <Field
                                                            name={`parts_used.${index}.name`}
                                                            placeholder="Nome da peça"
                                                            className="form-control"
                                                        />
                                                        <ErrorMessage name={`parts_used.${index}.name`} component="div" className="error-message" />
                                                    </div>

                                                    <div style={{ flex: 1 }}>
                                                        <Field
                                                            name={`parts_used.${index}.quantity`}
                                                            placeholder="Qtd"
                                                            type="number"
                                                            className="form-control"
                                                        />
                                                        <ErrorMessage name={`parts_used.${index}.quantity`} component="div" className="error-message" />
                                                    </div>

                                                    <div style={{ flex: 3 }}>
                                                        <Field
                                                            name={`parts_used.${index}.notes`}
                                                            placeholder="Observações"
                                                            className="form-control"
                                                        />
                                                    </div>

                                                    <button
                                                        type="button"
                                                        onClick={() => remove(index)}
                                                        className="btn"
                                                        style={{ background: '#e74c3c' }}
                                                    >
                                                        X
                                                    </button>
                                                </div>
                                            ))}

                                        <button
                                            type="button"
                                            onClick={() => push({ name: '', quantity: 1, notes: '' })}
                                            className="btn"
                                            style={{ marginTop: '10px' }}
                                        >
                                            Adicionar Peça
                                        </button>
                                    </div>
                                )}
                            </FieldArray>
                        </div>

                        <div className="form-group">
                            <label htmlFor="observations">Observações Adicionais</label>
                            <Field as="textarea" name="observations" className="form-control" rows="3" />
                        </div>

                        <button type="submit" className="btn" disabled={isSubmitting || loading}>
                            {loading ? 'Gerando Relatório...' : 'Gerar Relatório'}
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default ReportForm; 