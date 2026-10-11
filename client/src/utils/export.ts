import { ConversationAnalysis } from '../types/conversation';

// Download text file helper
function downloadFile(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Export as formatted JSON
export function exportAnalysisAsJSON(analysis: ConversationAnalysis) {
  const jsonStr = JSON.stringify(analysis, null, 2);
  downloadFile(jsonStr, `gaplens-analysis-${analysis.id}.json`, 'application/json');
}

// Export as CSV
export function exportAnalysisAsCSV(analysis: ConversationAnalysis) {
  const rows: string[][] = [
    ['Gap ID', 'Type', 'Speaker', 'Topic', 'Confidence', 'Status', 'Explanation', 'Evidence Count'],
  ];

  analysis.communicationGaps.forEach(gap => {
    rows.push([
      gap.id,
      gap.type,
      `"${gap.speaker || 'N/A'}"`,
      `"${gap.topic || 'General'}"`,
      `${Math.round(gap.confidence * 100)}%`,
      gap.status,
      `"${(gap.explanation || '').replace(/"/g, '""')}"`,
      String(gap.evidence.length),
    ]);
  });

  const csvContent = rows.map(r => r.join(',')).join('\n');
  downloadFile(csvContent, `gaplens-gaps-${analysis.id}.csv`, 'text/csv;charset=utf-8;');
}

// Trigger Print / PDF generation
export function triggerPrintReport() {
  window.print();
}
