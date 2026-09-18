import fs from 'node:fs/promises';
import path from 'node:path';

const root=path.resolve(import.meta.dirname,'..');
const config=JSON.parse(await fs.readFile(path.join(root,'config/sources.json'),'utf8'));
const existing=JSON.parse(await fs.readFile(path.join(root,'data/topics.json'),'utf8'));
const apiBase=process.env.DAILY_HOT_API||'https://api-hot.imsyy.top';
const matches=[];

for(const platform of config.hotPlatforms){
  try{
    const response=await fetch(`${apiBase}/${platform}`,{headers:{'User-Agent':'study-abroad-topic-radar/1.0'},signal:AbortSignal.timeout(12000)});
    if(!response.ok)continue;
    const payload=await response.json();
    const items=payload.data||payload.result||[];
    for(const item of items){
      const title=String(item.title||item.name||'');
      if(!config.keywords.some(k=>title.toLowerCase().includes(k.toLowerCase())))continue;
      matches.push({title,url:item.url||item.mobileUrl||'',platform,hot:Number(item.hot||item.hotValue||0)});
    }
  }catch(error){console.warn(`[skip] ${platform}: ${error.message}`);}
}

const generated=matches.slice(0,8).map((item,index)=>{
  const region=/香港|港校|DSE/.test(item.title)?'中国香港':/英国/.test(item.title)?'英国':/澳洲|澳大利亚/.test(item.title)?'澳大利亚':'综合';
  const heat=Math.max(65,92-index*3);const relevance=88;const anxiety=82;const freshness=94;const local=region==='中国香港'?84:70;
  const score=Math.round(heat*.30+relevance*.25+anxiety*.20+freshness*.15+local*.10);
  return {id:`auto-${Date.now()}-${index}`,topic:item.title,title:`${item.title}：留学家庭需要关注哪些变化？`,angle:'从公开热榜发现的候选议题，需要编辑结合官方原文进一步核实后再发布。',region,source:item.platform,url:item.url||'#',verified:false,keywords:config.keywords.filter(k=>item.title.includes(k)),score,heat,relevance,anxiety,freshness,local,trend:'↑ 热榜新增'};
});

const pinned=existing.topics.filter(t=>t.verified).slice(0,8);
const next={...existing,generatedAt:new Date().toISOString(),topics:[...generated,...pinned]};
await fs.writeFile(path.join(root,'data/topics.json'),JSON.stringify(next,null,2)+'\n');
console.log(`Generated ${next.topics.length} topics (${generated.length} live matches).`);
