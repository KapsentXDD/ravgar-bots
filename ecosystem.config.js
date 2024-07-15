module.exports = {
  apps: [
    {
      name: "ravgar_Mod1",
      namespace: "ravgar",
      script: 'main.aris',
      watch: false,
      exec_mode: "cluster",
      max_memory_restart: "2G",
      cwd: "./Bots/Executive"
    }, 
    {
      name: "ravgar_Guard_I",
      namespace: "ravgar",
      script: 'main.aris',
      watch: false,
      exec_mode: "cluster",
      max_memory_restart: "2G",
      cwd: "./Bots/Guard_I"
    }, 
    {
      name: "ravgar_Guard_II",
      namespace: "ravgar",
      script: 'main.aris',
      watch: false,
      exec_mode: "cluster",
      max_memory_restart: "2G",
      cwd: "./Bots/Guard_II"
    }, 
    {
      name: "ravgar_Guard_III",
      namespace: "ravgar",
      script: 'main.aris',
      watch: false,
      exec_mode: "cluster",
      max_memory_restart: "2G",
      cwd: "./Bots/Guard_III"
    }, 
    {
      name: "ravgar_Guard_IV",
      namespace: "ravgar",
      script: 'main.aris',
      watch: false,
      exec_mode: "cluster",
      max_memory_restart: "2G",
      cwd: "./Bots/Guard_IV"
    },   
    {
      name: "ravgar_Mod2",
      namespace: "ravgar",
      script: 'main.aris',
      watch: false,
      exec_mode: "cluster",
      max_memory_restart: "2G",
      cwd: "./Bots/ExecutivePlus"
    },
  ]
};


