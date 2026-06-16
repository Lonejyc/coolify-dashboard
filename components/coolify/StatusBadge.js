/**
 * StatusBadge Component
 *
 * Affiche un badge coloré pour le statut d'une ressource Coolify
 * (application, database, service, etc.)
 *
 * @param {string} status - Le statut de la ressource
 * @param {string} size - Taille du badge ('sm', 'md', 'lg')
 *
 * Status possibles:
 * - running: Vert (en cours d'exécution)
 * - stopped: Rouge (arrêté)
 * - degraded: Jaune (dégradé/problème)
 * - restarting: Bleu (redémarrage en cours)
 * - exited: Gris (crash/sortie)
 * - unknown: Blanc (statut inconnu)
 */

import {
  FiCircle,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiRefreshCw,
} from "react-icons/fi";

const StatusBadge = ({ status = "unknown", size = "md" }) => {
  // Configuration des styles par statut
  const statusConfig = {
    running: {
      label: "Running",
      icon: FiCheckCircle,
      bgColor: "bg-emerald-500/10",
      textColor: "text-emerald-400",
      borderColor: "border-emerald-500/30",
      dotColor: "text-emerald-500",
    },
    stopped: {
      label: "Stopped",
      icon: FiXCircle,
      bgColor: "bg-red-500/10",
      textColor: "text-red-400",
      borderColor: "border-red-500/30",
      dotColor: "text-red-500",
    },
    exited: {
      label: "Exited",
      icon: FiXCircle,
      bgColor: "bg-red-500/10",
      textColor: "text-red-400",
      borderColor: "border-red-500/30",
      dotColor: "text-red-500",
    },
    degraded: {
      label: "Degraded",
      icon: FiAlertCircle,
      bgColor: "bg-yellow-500/10",
      textColor: "text-yellow-400",
      borderColor: "border-yellow-500/30",
      dotColor: "text-yellow-500",
    },
    restarting: {
      label: "Restarting",
      icon: FiRefreshCw,
      bgColor: "bg-blue-500/10",
      textColor: "text-blue-400",
      borderColor: "border-blue-500/30",
      dotColor: "text-blue-500",
      animate: true,
    },
    unknown: {
      label: "Unknown",
      icon: FiCircle,
      bgColor: "bg-slate-500/10",
      textColor: "text-slate-400",
      borderColor: "border-slate-500/30",
      dotColor: "text-slate-400",
    },
  };

  // Tailles disponibles
  const sizeConfig = {
    sm: {
      padding: "px-2 py-1",
      text: "text-xs",
      icon: "text-xs",
    },
    md: {
      padding: "px-3 py-1.5",
      text: "text-sm",
      icon: "text-sm",
    },
    lg: {
      padding: "px-4 py-2",
      text: "text-base",
      icon: "text-base",
    },
  };

  // Récupérer la config pour le statut (défaut: unknown)
  const config = statusConfig[status] || statusConfig.unknown;
  const sizeStyles = sizeConfig[size] || sizeConfig.md;
  const Icon = config.icon;

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-full border
        ${config.bgColor}
        ${config.textColor}
        ${config.borderColor}
        ${sizeStyles.padding}
        ${sizeStyles.text}
        font-medium
        transition-all duration-200
        backdrop-blur-sm
      `}
    >
      <Icon
        className={`
          ${sizeStyles.icon} 
          ${config.dotColor}
          ${config.animate ? "animate-spin" : ""}
        `}
      />
      <span>{config.label}</span>
    </span>
  );
};

export default StatusBadge;
