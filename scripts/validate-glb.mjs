import {readFile,readdir,mkdir,writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import validator from 'gltf-validator';
const root='client/public/models/factions',reports=[];
for(const path of (await readdir(root,{recursive:true})).filter(p=>p.endsWith('.glb')).sort()){
  const data=await readFile(join(root,path));
  const result=await validator.validateBytes(new Uint8Array(data),{uri:path,maxIssues:1000});
  reports.push({file:path,errors:result.issues.numErrors,warnings:result.issues.numWarnings,infos:result.issues.numInfos,messages:result.issues.messages});
}
const errors=reports.reduce((n,r)=>n+r.errors,0),warnings=reports.reduce((n,r)=>n+r.warnings,0);
await mkdir('artifacts',{recursive:true});await writeFile('artifacts/glb-validation.json',JSON.stringify({validator:'Khronos glTF-Validator',models:reports.length,errors,warnings,reports},null,2)+'\n');
console.log('Khronos glTF validation:',reports.length,'GLB;',errors,'errors;',warnings,'warnings');
if(errors)process.exitCode=1;
