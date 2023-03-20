import{_ as e,o as a,c as s,N as t}from"./chunks/framework.e2c189b6.js";const u=JSON.parse('{"title":"Deploying","description":"","frontmatter":{},"headers":[],"relativePath":"packages/server/docker.md"}'),o={name:"packages/server/docker.md"},n=t(`<h1 id="deploying" tabindex="-1">Deploying <a class="header-anchor" href="#deploying" aria-label="Permalink to &quot;Deploying&quot;">​</a></h1><p>The auth server can be deployed using the provided docker image:</p><div class="language-shell"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#FFCB6B;">$</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">docker</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">pull</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">ghcr.io/tada5hi/authup-server:latest</span></span>
<span class="line"></span></code></pre></div><p>To change the default configuration use environment variables (<code>--env &lt;key&gt;=&lt;value&gt;</code>). Read the <a href="./../server-http/">API Reference</a> for available environment variables.</p>`,4),l=[n];function r(p,c,i,d,_,h){return a(),s("div",null,l)}const v=e(o,[["render",r]]);export{u as __pageData,v as default};
