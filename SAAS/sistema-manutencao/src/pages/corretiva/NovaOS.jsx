// src/pages/corretiva/NovaOS.jsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  TextField, 
  Button, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  FormControlLabel, 
  Checkbox,
  Grid,
  Typography,
  Paper
} from '@mui/material';

const PageTitle = styled(Typography)`
  margin-bottom: 20px;
`;

const FormContainer = styled(Paper)`
  padding: 24px;
  margin-bottom: 24px;
`;

const FormGroup = styled.div`
  margin-bottom: 16px;
`;

const ButtonContainer = styled.div`
  margin-top: 24px;
  display: flex;
  justify-content: flex-end;
  
  button {
    margin-left: 12px;
  }
`;

const NovaOSCorretiva = () => {
  const [formValues, setFormValues] = useState({
    equipamento: '',
    local: '',
    prioridade: 'media',
    descricaoProblema: '',
    tecnicoResponsavel: '',
    dataAbertura: new Date().toISOString().substr(0, 10),
    horaAbertura: new Date().toTimeString().substr(0, 5),
    parada: false,
    materiaisNecessarios: ''
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormValues({
      ...formValues,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aqui você enviaria os dados para o backend
    console.log("Dados da OS:", formValues);
    alert("OS criada com sucesso!");
  };

  return (
    <div>
      <PageTitle variant="h4">Nova Ordem de Serviço Corretiva</PageTitle>
      
      <form onSubmit={handleSubmit}>
        <FormContainer elevation={2}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Informações do Equipamento
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Equipamento</InputLabel>
                <Select
                  name="equipamento"
                  value={formValues.equipamento}
                  onChange={handleChange}
                  required
                >
                  <MenuItem value="bomba1">Bomba Centrífuga #1</MenuItem>
                  <MenuItem value="bomba2">Bomba Centrífuga #2</MenuItem>
                  <MenuItem value="motor1">Motor Elétrico #1</MenuItem>
                  <MenuItem value="compressor1">Compressor #1</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Local/Setor</InputLabel>
                <Select
                  name="local"
                  value={formValues.local}
                  onChange={handleChange}
                  required
                >
                  <MenuItem value="producao">Produção</MenuItem>
                  <MenuItem value="estacao">Estação de Bombeamento</MenuItem>
                  <MenuItem value="utilidades">Utilidades</MenuItem>
                  <MenuItem value="refrigeracao">Refrigeração</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Prioridade</InputLabel>
                <Select
                  name="prioridade"
                  value={formValues.prioridade}
                  onChange={handleChange}
                >
                  <MenuItem value="baixa">Baixa</MenuItem>
                  <MenuItem value="media">Média</MenuItem>
                  <MenuItem value="alta">Alta</MenuItem>
                  <MenuItem value="urgente">Urgente</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="parada"
                    checked={formValues.parada}
                    onChange={handleChange}
                  />
                }
                label="Equipamento parado?"
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                label="Descrição do Problema"
                name="descricaoProblema"
                value={formValues.descricaoProblema}
                onChange={handleChange}
                multiline
                rows={4}
                fullWidth
                required
              />
            </Grid>
          </Grid>
        </FormContainer>
        
        <FormContainer elevation={2}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Informações da Manutenção
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Técnico Responsável</InputLabel>
                <Select
                  name="tecnicoResponsavel"
                  value={formValues.tecnicoResponsavel}
                  onChange={handleChange}
                  required
                >
                  <MenuItem value="joao">João Silva</MenuItem>
                  <MenuItem value="maria">Maria Oliveira</MenuItem>
                  <MenuItem value="carlos">Carlos Pereira</MenuItem>
                  <MenuItem value="ana">Ana Souza</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <TextField
                label="Data de Abertura"
                type="date"
                name="dataAbertura"
                value={formValues.dataAbertura}
                onChange={handleChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            
            <Grid item xs={12} md={3}>
              <TextField
                label="Hora de Abertura"
                type="time"
                name="horaAbertura"
                value={formValues.horaAbertura}
                onChange={handleChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                label="Materiais Necessários"
                name="materiaisNecessarios"
                value={formValues.materiaisNecessarios}
                onChange={handleChange}
                multiline
                rows={3}
                fullWidth
                placeholder="Liste os materiais e peças necessários para o serviço"
              />
            </Grid>
          </Grid>
        </FormContainer>
        
        <ButtonContainer>
          <Button variant="outlined" color="secondary">
            Cancelar
          </Button>
          <Button variant="contained" color="primary" type="submit">
            Criar OS
          </Button>
        </ButtonContainer>
      </form>
    </div>
  );
};

export default NovaOSCorretiva;