import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Chip,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Remove,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  color: string;
  trend?: {
    value: number;
    period: string;
  };
  progress?: {
    value: number;
    max: number;
    label: string;
  };
  delay?: number;
  onClick?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  color,
  trend,
  progress,
  delay = 0,
  onClick
}) => {
  const getTrendIcon = () => {
    if (!trend) return null;
    if (trend.value > 0) return <TrendingUp fontSize="small" />;
    if (trend.value < 0) return <TrendingDown fontSize="small" />;
    return <Remove fontSize="small" />;
  };

  const getTrendColor = () => {
    if (!trend) return 'text.secondary';
    if (trend.value > 0) return 'success.main';
    if (trend.value < 0) return 'error.main';
    return 'text.secondary';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
    >
      <Card
        sx={{
          height: '100%',
          background: `linear-gradient(135deg, ${color}10 0%, ${color}05 100%)`,
          border: `1px solid ${color}20`,
          transition: 'all 0.3s ease',
          cursor: onClick ? 'pointer' : 'default',
          '&:hover': {
            transform: onClick ? 'translateY(-4px)' : 'none',
            boxShadow: onClick ? `0 10px 30px ${color}20` : 'inherit',
          },
        }}
        onClick={onClick}
      >
        <CardContent sx={{ p: 3 }}>
          <Box display="flex" alignItems="flex-start" justifyContent="space-between" mb={2}>
            <Box flex={1}>
              <Typography variant="h3" fontWeight="bold" color={color} gutterBottom>
                {typeof value === 'number' ? value.toLocaleString() : value}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {title}
              </Typography>
              {subtitle && (
                <Typography variant="caption" color="text.secondary">
                  {subtitle}
                </Typography>
              )}
            </Box>
            <Box
              sx={{
                p: 2,
                borderRadius: '12px',
                backgroundColor: `${color}15`,
                color: color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: 48,
                minHeight: 48,
              }}
            >
              {icon}
            </Box>
          </Box>

          {/* Trend indicator */}
          {trend && (
            <Box display="flex" alignItems="center" mb={progress ? 1 : 0}>
              <Box
                display="flex"
                alignItems="center"
                sx={{ color: getTrendColor() }}
              >
                {getTrendIcon()}
                <Typography
                  variant="body2"
                  sx={{ ml: 0.5, fontWeight: 600 }}
                >
                  {trend.value > 0 ? '+' : ''}{trend.value}%
                </Typography>
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                vs {trend.period}
              </Typography>
            </Box>
          )}

          {/* Progress indicator */}
          {progress && (
            <Box>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="caption" color="text.secondary">
                  {progress.label}
                </Typography>
                <Chip
                  label={`${Math.round((progress.value / progress.max) * 100)}%`}
                  size="small"
                  sx={{
                    backgroundColor: `${color}20`,
                    color: color,
                    fontWeight: 600,
                    height: 20,
                  }}
                />
              </Box>
              <LinearProgress
                variant="determinate"
                value={(progress.value / progress.max) * 100}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: `${color}10`,
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: color,
                    borderRadius: 3,
                  },
                }}
              />
            </Box>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StatCard;
