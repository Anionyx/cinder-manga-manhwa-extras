// Experimental Grand Comics Database SERIES catalog for Cinder.
// Metadata only: it does not provide comic downloads or readable pages.
var GCD = {
  id:"gcd-comics-experimental",
  name:"Grand Comics Database (Experimental)",
  version:"0.1.0",
  icon:"albums-outline",
  description:"Search comic series in GCD. Metadata only; no issue covers or reading.",
  contentType:"comics",
  contentTypes:["comics"],
  capabilities:{search:true,discover:false,download:false,resolve:false,searchDownloads:false,manga:false}
};
GCD.search=async function(query,page){
  if(!query || !String(query).trim())return [];
  var url="https://www.comics.org/api/series/name/"+encodeURIComponent(String(query).trim())+"/";
  var response=await cinder.fetch(url,{headers:{"Accept":"application/json"},timeout:20000});
  if(!response || response.status<200 || response.status>=300)throw Error("GCD API request failed");
  var data=JSON.parse(response.data);
  var entries=Array.isArray(data)?data:(data.results||data.series||data.items||data.data||[]);
  if(!Array.isArray(entries))throw Error("GCD API response format not recognized");
  return entries.filter(function(x){return x&&typeof x==="object";}).map(function(x){
    var id=x.id||x.series_id||x.pk, title=x.name||x.title||x.series_name;
    if(!id||!title)return null;
    var publisher=x.publisher && (typeof x.publisher==="string"?x.publisher:x.publisher.name);
    var year=x.year_began||x.year||x.publication_year;
    return {id:"gcd-series-"+id,title:String(title)+(year?" ("+year+")":""),author:publisher||"Grand Comics Database",description:"Comic series catalog record (metadata only; no downloadable issues or guaranteed cover art).",source:"Grand Comics Database",contentType:"comics",extra:{description:"GCD series metadata; not a reading source",gcdSeriesId:id}};
  }).filter(Boolean);
};
__cinderExport=GCD;
