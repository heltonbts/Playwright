'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { addDays, differenceInCalendarDays, parse } from 'date-fns';
import {
  Box,
  Typography,
  Button,
  Alert,
  Grid,
  Paper,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import TableViewIcon from '@mui/icons-material/TableView';
import Layout from '@/components/Layout';
import MultasTable from '@/components/MultasTable';
import StatusCard from '@/components/StatusCard';
import { obterResultado, baixarExcel, baixarPDF } from '@/lib/api';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

const parseDataBR = (value: string) => {
  if (!value) return null;
  const parsed = parse(value, 'dd/MM/yyyy', new Date());
  if (!Number.isNaN(parsed.getTime())) return parsed;
  const fallback = new Date(value);
  return Number.isNaN(fallback.getTime()) ? null : fallback;
};

const dentroPrazoIndicacao = (dataNotificacao: string) => {
  const data = parseDataBR(dataNotificacao);
  if (!data) return false;
  const hoje = new Date();
  const diff = differenceInCalendarDays(hoje, data);
  return diff >= 0 && diff <= 30;
};

function ResultadosContent() {
  const searchParams = useSearchParams();
  const consultaId = searchParams.get('id') || '';

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['resultado', consultaId],
    queryFn: () => obterResultado(consultaId),
    enabled: !!consultaId,
  });

  React.useEffect(() => {
    if (data?.multas && data.multas.length > 0) {
      localStorage.setItem('ultimas_multas', JSON.stringify(data.multas));
    }
  }, [data?.multas]);

  const handleBaixarExcel = async () => {
    try {
      await baixarExcel(consultaId);
    } catch (downloadError) {
      console.error('Erro ao baixar Excel:', downloadError);
    }
  };

  const handleBaixarPDF = async (ait: string) => {
    try {
      if (data?.pdf_paths && data.pdf_paths.length > 0) {
        await baixarPDF(consultaId, data.pdf_paths[0]);
      }
    } catch (downloadError) {
      console.error('Erro ao baixar PDF:', downloadError);
    }
  };

  if (!consultaId) {
    return (
      <Layout>
        <Alert severity="warning">Consulta não informada. Volte e selecione uma consulta.</Alert>
      </Layout>
    );
  }

  if (isLoading) {
    return (
      <Layout>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography>Carregando resultados...</Typography>
        </Box>
      </Layout>
    );
  }

  if (isError) {
    return (
      <Layout>
        <Alert severity="error">Erro ao carregar resultados: {(error as Error).message}</Alert>
      </Layout>
    );
  }

  const multas = data?.multas || [];
  const totalMultas = data?.total_multas || 0;
  const valorTotal = data?.valor_total || 0;
  const placasAptas = Array.from(
    new Set(multas.filter(m => dentroPrazoIndicacao(m.data_infracao)).map(m => m.placa))
  );

  const formatarValor = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(valor);
  };

  return (
    <Layout>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom fontWeight={600}>
          Resultados da Consulta
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Resumo e detalhamento das multas encontradas
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <StatusCard title="Multas Encontradas" value={totalMultas} icon={<WarningAmberIcon />} color="warning" />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatusCard title="Valor Total" value={formatarValor(valorTotal)} icon={<AttachMoneyIcon />} color="error" />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatusCard
            title="PDFs Gerados"
            value={data?.pdf_paths?.length || 0}
            icon={<PictureAsPdfIcon />}
            color="success"
          />
        </Grid>
      </Grid>

      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button variant="contained" startIcon={<TableViewIcon />} onClick={handleBaixarExcel} size="large">
            Baixar Excel
          </Button>
          <Button
            variant="outlined"
            startIcon={<PictureAsPdfIcon />}
            size="large"
            disabled={!data?.pdf_paths || data.pdf_paths.length === 0}
            onClick={() => handleBaixarPDF('')}
          >
            Baixar PDF
          </Button>
        </Box>
      </Paper>

      {placasAptas.length > 0 && (
        <Alert severity="success" sx={{ mb: 3 }}>
          <Typography fontWeight={600}>
            {placasAptas.length === 1
              ? `O veículo ${placasAptas[0]} está apto a indicar condutor (até 30 dias da notificação).`
              : `Os veículos ${placasAptas.join(', ')} estão aptos a indicar condutor (até 30 dias da notificação).`}
          </Typography>
        </Alert>
      )}

      {multas.length === 0 ? (
        <Paper elevation={2} sx={{ p: 6, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            Nenhuma multa encontrada
          </Typography>
        </Paper>
      ) : (
        <MultasTable multas={multas} onDownloadPDF={handleBaixarPDF} />
      )}
    </Layout>
  );
}

export default function Resultados() {
  return (
    <Suspense fallback={<Layout><Alert severity="info">Carregando...</Alert></Layout>}>
      <ResultadosContent />
    </Suspense>
  );
}
