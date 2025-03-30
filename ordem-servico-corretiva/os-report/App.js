import React, { useState, useEffect } from 'react';
import './App.css';

// ... código existente ...

// Alterar apenas a função handleSaveDocument com melhor tratamento de erros
const handleSaveDocument = async () => {
    setIsLoading(true);
    setError(null);

    // Prepara o documento para ser salvo
    const documentoData = {
        osNumber,
        manutencaoCorretiva,
        naoProgramados,
        dados: {
            formData,
            attachments,
            actionItems,
            conclusao
        },
        // Extrair campos principais para facilitar busca
        codigoManutencao: formData.codigoManutencao,
        dataSolicitacao: formData.dataSolicitacao,
        dataExecucao: formData.dataExecucao,
        nomeEquipamento: formData.nomeEquipamento,
        localizacao: formData.localizacao,
        requisitante: formData.requisitante
    };

    try {
        let documentoSalvo;

        // Verificar se o backend está disponível
        try {
            await fetch(`${process.env.REACT_APP_API_URL}/health`, {
                method: 'GET',
                timeout: 5000
            });
        } catch (healthError) {
            console.error('Backend não está acessível:', healthError);
            setError('O servidor de backend não está disponível. Verifique se o serviço está em execução.');
            setIsLoading(false);
            return;
        }

        // Primeiro, tenta recuperar todos os documentos para verificar se já existe um com o mesmo número de OS
        const documentosExistentes = await documentosService.listarDocumentos(0, 100);
        const documentoExistente = documentosExistentes.find(doc => doc.osNumber === osNumber);

        if (documentoExistente) {
            // Se já existe um documento com o mesmo número de OS, atualiza-o
            console.log('Encontrado documento existente, atualizando...', documentoExistente.id);
            documentoSalvo = await documentosService.atualizarDocumento(documentoExistente.id, documentoData);
        } else {
            // Caso contrário, cria um novo documento
            console.log('Criando novo documento...');
            documentoSalvo = await documentosService.criarDocumento(documentoData);
        }

        // Atualiza o estado com o documento salvo
        setSavedDocument(documentoSalvo);
        setViewMode('view');

        // Atualiza a URL para refletir o documento visualizado - usar um formato claro com o número da OS
        const url = new URL(window.location);
        url.searchParams.delete('document'); // Remover parâmetro antigo se existir
        url.pathname = `/documento/${documentoSalvo.osNumber}/${documentoSalvo.id}`; // Formato mais claro
        window.history.pushState({}, '', url);

        // Exibir mensagem de sucesso para o usuário
        console.log(`Documento salvo com sucesso: OS-${osNumber}`);
        // Forçar a atualização do banco de dados para refletir as mudanças
        await documentosService.listarDocumentos(0, 1, true); // true = forçar atualização do cache
    } catch (err) {
        console.error('Erro detalhado ao salvar documento:', {
            message: err.message,
            status: err.response?.status,
            statusText: err.response?.statusText,
            data: err.response?.data
        });

        // Mensagem de erro mais específica para o usuário
        let mensagemErro = 'Não foi possível salvar o documento.';

        if (err.response) {
            if (err.response.status === 404) {
                mensagemErro += ' Endpoint da API não encontrado. Verifique se o backend está em execução.';
            } else if (err.response.status === 500) {
                mensagemErro += ' Erro interno no servidor.';
            } else {
                mensagemErro += ` Erro ${err.response.status}: ${err.response.statusText || ''}`;
            }

            if (err.response.data && err.response.data.detail) {
                mensagemErro += ` Detalhe: ${err.response.data.detail}`;
            }
        } else if (err.request) {
            mensagemErro += ' Não foi possível conectar ao servidor. Verifique sua conexão e se o backend está em execução.';
        } else {
            mensagemErro += ` ${err.message}`;
        }

        setError(mensagemErro);
    } finally {
        setIsLoading(false);
    }
};

// ... resto do código existente ... 