const fs = require('fs');
let content = fs.readFileSync('server/analyzer.ts', 'utf8');

const regex = /export async function runPairwiseAttractivenessAnalysis\([\s\S]*?\): Promise<ComparisonResult> {/;
const replace = `export async function runPairwiseAttractivenessAnalysis(
  imageADataUrl: string,
  imageBDataUrl: string,
  nameA: string,
  nameB: string,
  clientAnalysisId?: string
): Promise<ComparisonResult> {`;

content = content.replace(regex, replace);

// Fix the roastData call
const regex2 = /const roastData = generateResultAwareRoast\(partialForRoast, .*?\);/g;
content = content.replace(regex2, `const roastData = generateResultAwareRoast(partialForRoast, { style: 'SAVAGE', intensity: 'SAVAGE', names: { A: nameA || 'Person A', B: nameB || 'Person B' } });`);

fs.writeFileSync('server/analyzer.ts', content);
