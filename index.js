
const { Telegraf } = require('telegraf')
const axios= require('axios');
const dateFormat=require('dateformat');
const express= require('express');
const expressApp= express();
const API_TOKEN= process.env.API_TOKEN||'Your_Telegram_bot_token'; // replace with your telegram bot Token
const PORT= process.env.PORT || 5000;  
const URL= process.env.URL||'https://your_app_id.herokuapp.com'; // replace it with your APP URL Domain given when you create heroku app
const bot = new Telegraf( API_TOKEN);
bot.telegram.setWebhook(`${URL}/bot${API_TOKEN}`);
expressApp.use(bot.webhookCallback(`/bot${API_TOKEN}`));

bot.start((ctx)=>{

 let message=`Hey ${ctx.from.first_name} , Welcome to covid bot `
 bot.telegram.sendMessage(ctx.chat.id, message,{
   reply_markup:{
       inline_keyboard:[
           [{ text:'Ethiopia 🇪🇹', callback_data:'ethiopia'}],
           [{ text:'World 🌍', callback_data:'world'}]
       ]
   }



 });  


})

bot.action('ethiopia',(ctx)=>{
 ctx.answerCbQuery('button clicked');
 let getdata=async()=>{
   try {
       const urlData=await axios.get('https://disease.sh/v3/covid-19/countries/Ethiopia');

    let updated=urlData.data.updated;
    let C=urlData.data.cases;
    let TC=urlData.data.todayCases;
    let D=urlData.data.deaths;
    let TD= urlData.data.todayDeaths;
    let R=urlData.data.recovered;
    let TR=urlData.data.todayRecovered
    let Act=urlData.data.active;
    let Cr= urlData.data.critical;
    let Ts= urlData.data.tests;
    let PP= urlData.data. population;
    
     let timeupdated= dateFormat(new Date(updated), "dddd, mmmm dS, yyyy, h:MM:ss TT");

     let table=`
     
      Covid-19 status in Ethiopia
      updated \at : ${timeupdated}
       \`
       +--------------------------+
       |Today Case      | ${TC}
       +--------------------------+
       |Today Death     | ${TD}
       +--------------------------+
       |Today Recovered | ${TR}
       +--------------------------+
       |Total Case      | ${C}
       +--------------------------+
       |Total Death     |${D}
       +--------------------------+
       |Total Recover   |${R}
       +--------------------------+
       |Active Case     |${Act}
       +--------------------------+
       |Critical Case   |${Cr}
       +--------------------------+
       |Total Test      |${Ts}
       +--------------------------+
       | Population    |${PP}
       +--------------------------+
       
       
       
       \`

     `
     bot.telegram.sendMessage(ctx.chat.id, table,{
         parse_mode:'Markdown'
     });


       
   } catch (error) {
        console.error('error occured'+error);
   }
     

 }
 getdata();


})

bot.action('world',(ctx)=>{
    ctx.answerCbQuery('button clicked');
    let getdata=async()=>{
      try {
          const urlData=await axios.get('https://disease.sh/v3/covid-19/all');
   
       let updated=urlData.data.updated;
       let C=urlData.data.cases;
       let TC=urlData.data.todayCases;
       let D=urlData.data.deaths;
       let TD= urlData.data.todayDeaths;
       let R=urlData.data.recovered;
       let TR=urlData.data.todayRecovered
       let Act=urlData.data.active;
       let Cr= urlData.data.critical;
       let Ts= urlData.data.tests;
       let PP= urlData.data. population;
       
        let timeupdated= dateFormat(new Date(updated), "dddd, mmmm dS, yyyy, h:MM:ss TT");
   
        let table=`
        
          \Global Covid-19 status 
         updated \at : ${timeupdated}
          \`
          +--------------------------+
          |Today Case      | ${TC}
          +--------------------------+
          |Today Death     | ${TD}
          +--------------------------+
          |Today Recovered | ${TR}
          +--------------------------+
          |Total Case      | ${C}
          +--------------------------+
          |Total Death     |${D}
          +--------------------------+
          |Total Recover   |${R}
          +--------------------------+
          |Active Case     |${Act}
          +--------------------------+
          |Critical Case   |${Cr}
          +--------------------------+
          |Total Test      |${Ts}
          +--------------------------+
          | Population    |${PP}
          +--------------------------+
          
          
          
          \`
   
        `
        bot.telegram.sendMessage(ctx.chat.id, table,{
            parse_mode:'Markdown'
        });
   
   
          
      } catch (error) {
           console.error('error occured'+error);
      }
        
   
    }
    getdata();
   
   
   })
   



expressApp.get('/', (req,res)=>{

  res.send(' your bot is running');
});
expressApp.listen(PORT,()=>{


console.log(`server \is running \on port${PORT}`);

});
