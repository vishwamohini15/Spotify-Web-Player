console.log("let write javascript");

let currentSong = new Audio();
let songs;
let currfolder;

function secondsToMinutesSeconds(seconds) {
     if(isNaN(seconds)|| seconds < 0){
          return "00:00";
     }
     // Calculate minutes and remaining seconds
     var minutes = Math.floor(seconds / 60);
     var remainingSeconds =Math.floor (seconds % 60);
 
     // Format minutes and seconds with leading zeros if necessary
     var formattedMinutes = String(minutes).padStart(2, '0');
     var formattedSeconds = String(remainingSeconds).padStart(2, '0');
 
     // Combine minutes and seconds in the desired format
     var formattedTime = formattedMinutes + ':' + formattedSeconds;
 
     return formattedTime;
 }
 
 // Example usage
 var seconds = 72; // Change this value as needed
 var formattedTime = secondsToMinutesSeconds(seconds);
//  console.log(formattedTime); // Output: 01:12
 

async function getsongs(folder){
currfolder=folder;
let a=await fetch(`http://127.0.0.1:5500/${folder}/`)
let responds=await a.text();
// console.log(responds);
let div=document.createElement("div")
div.innerHTML=responds;
let as=div.getElementsByTagName("a")

 songs=[]
for (let index = 0; index < as.length; index++) {
     const element = as[index];
     if(element.href.endsWith(".mp3")){
          songs.push(element.href.split(`/${folder}/`)[1])
     }
}


    //show all the songs in the playlist
    let songUL=document.querySelector(".songlist").getElementsByTagName("ul")[0]
    songUL.innerHTML=""
    for (const song of songs) {
         songUL.innerHTML=songUL.innerHTML + `<li>
              <img class="invert" src="music.svg" alt="">
              <div class="info">
                   <div> ${song.replaceAll("%20"," ")}</div>
                   <div>vishwamohini</div>
              </div>
              <div class="playnow">
                   <span>play Now</span>
                   <img class="invert" src="play.svg" alt="">
              </div>
        </li>`;
    }
    
    //attach an event listener to each songs
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e=>{
         e.addEventListener("click",element=>{
              // console.log(e.querySelector(".info").firstElementChild.innerHTML);
              playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
         })
    })

}

const playMusic=(track,pause=false)=>{
     // let audio=new Audio("/songs/" + track)
     currentSong.src=`/${currfolder}/` + track
     if(!pause){
          currentSong.play()
     play.src="paused.svg"

     }
     document.querySelector(".songinfo").innerHTML=decodeURI(track)
     document.querySelector(".songtime").innerHTML="00:00"


     


}

async function displayAlbums() {
     let a = await fetch(`http://127.0.0.1:5500/songs/`);
     let responds = await a.text();
     let div = document.createElement("div");
     div.innerHTML = responds;
     let anchors = div.getElementsByTagName("a");
 
     let cardcontainer=document.querySelector(".cardcontainer")
     let array=Array.from(anchors)
          for (let index = 0; index < array.length; index++) {
               const e = array[index];
               
          
         if (e.href.includes("/songs")) {
             let folder = e.href.split("/").slice(-2)[0];
             console.log("Folder:", folder); // Add logging to check folder name
             let url = `/songs/${folder}/info.json`;
            console.log("URL:", url); // Add logging to check the URL
             let a = await fetch(url);
             let responds = await a.json();
             console.log(responds);

             cardcontainer.innerHTML=cardcontainer.innerHTML+ `  <div  data-folder="cs"  class="card ">
             <div class="play">
                  <svg width="65" height="65" xmlns="http://www.w3.org/2000/svg">
                       <rect x="2" y="2" width="61" height="61" rx="30" ry="30"
                            style="fill: #1fdf64; stroke: #1fdf64;  stroke-width: 3;" />
                       <image href="https://cdn.hugeicons.com/icons/play-stroke-rounded.svg" x="7"
                            y="7" width="51" height="51" />
                  </svg>
             </div>
             <img src="/songs/${folder}/cover.png" alt="">
             <h2>${responds.title}</h2>
             <p>${responds.description}</p>
        </div>`
         }
     }
     };

     //load the playlist whenever the card is clicked
Array.from( document.getElementsByClassName("card")).forEach(e=>{
     e.addEventListener("click",async item=>{
          songs= await getsongs(`songs/${item.currentTarget.dataset.folder}`)

     })
})
 
 
 displayAlbums();
 






async function main(){

     // get the list of all the songs
       await getsongs("songs/ncs")
     // console.log(songs);
playMusic(songs[0],true)


//display all the albums on the page 
displayAlbums()


//attatch an event listner to play next and previous
play.addEventListener("click",()=>{
     if(currentSong.paused){
          currentSong.play()
          play.src="paused.svg"
     }
     else{
          currentSong.pause()
          play.src="play.svg"
     }
})

//listen for timeupdate event

currentSong.addEventListener("timeupdate",()=>{
     // console.log(currentSong.currentTime, currentSong.duration);
     document.querySelector(".songtime").innerHTML=`${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`
     
     document.querySelector(".circle").style.left=(currentSong.currentTime / currentSong.duration
     )* 100 + "%";
     })


//add an event listnear to seek bar
document.querySelector(".seekbar").addEventListener("click",e=>{
     let percent=(e.offsetX/e.target.getBoundingClientRect().width)*100; 
     document.querySelector(".circle").style.left=percent + "%";
     currentSong.currentTime=(currentSong.duration)*percent /100
})

//add an event listner on hamburger
document.querySelector(".hamburger").addEventListener("click",()=>{
     document.querySelector(".left").style.left=0;
})

//add an event listner on close btn
document.querySelector(".close").addEventListener("click",()=>{
     document.querySelector(".left").style.left="-110%";
})

//add an event listner to prev and next
previous.addEventListener("click",()=>{
     // console.log("prev clicked");
     // console.log(currentSong);
     let index=songs.indexOf(currentSong.src.split("/").slice(-1)[0])
     if((index - 1)>= 0){
          playMusic(songs[index - 1])
     }

     })


//add an event listner to  next
next.addEventListener("click",()=>{
     // console.log("next clicked");
     let index=songs.indexOf(currentSong.src.split("/").slice(-1)[0])
     // console.log(currentSong.src.split("/").slice(-1))[0]
     // console.log(songs, index);
     if((index+1) < songs.length){
          playMusic(songs[index + 1])
     }

     })

//add an event to volumn
document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
     // console.log(e);
     currentSong.volume=parseInt(e.target.value)/100
})




}
main()

















// currentSong.addEventListener("timeupdate",()=>{
//      console.log(currentSong.currentTime, currentSong.duration);
//      document.querySelector(".songtime").innerHTML=`${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`
     
//      document.querySelector(".circle").style.left=(currentSong.currentTime / currentSong.duration
//      )* 100 + "%";
//      })

















    //show all the songs in the playlist
//     let songUL=document.querySelector(".songlist").getElementsByTagName("ul")[0]
//     for (const song of songs) {
//          songUL.innerHTML=songUL.innerHTML + `<li>
//               <img class="invert" src="music.svg" alt="">
//               <div class="info">
//                    <div> ${song.replaceAll("%20"," ")}</div>
//                    <div>vishwamohini</div>
//               </div>
//               <div class="playnow">
//                    <span>play Now</span>
//                    <img class="invert" src="play.svg" alt="">
//               </div>
//         </li>`;
//     }
    
//     //attach an event listener to each songs
//     Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e=>{
//          e.addEventListener("click",element=>{
//               // console.log(e.querySelector(".info").firstElementChild.innerHTML);
//               playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
//          })
//     })









// async function displayAlbums(){
//      let a=await fetch(`http://127.0.0.1:5500/songs/`)
// let responds=await a.text();
// console.log(responds);??
// let div=document.createElement("div")
// div.innerHTML=responds;
// let anchors= div.getElementsByTagName("a")
// Array.from (anchors).forEach(async e=>{
//      if(e.href.includes("/songs")){
//      let folder=(e.href.split("/").slice(-2)[0]);
//      let a=await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`)
//      let responds=await a.json();
//      console.log(responds);
//      }
// })
// console.log(anchors);
// }