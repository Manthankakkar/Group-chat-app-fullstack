const btn=document.getElementById("submitbutton")
const div=document.getElementById("div")
btn.addEventListener("click",async(e)=>{
e.preventDefault()
const email=document.getElementById("email").value.trim()
const password=document.getElementById("password").value.trim()
if (!email || !password){
div.innerHTML=""
const p=document.createElement("p")
p.innerHTML="fiels cant be empty"
p.style.color="red"
div.appendChild(p)

}
try{
    const res=await axios.post("http://localhost:3000/api/user/login",{email,password})
    if (res.data.success){
        div.innerHTML=""
        const p=document.createElement("p")
        p.innerHTML="login successful"
        p.style.color="green"
        div.appendChild(p)
    }
}catch(err){
     div.innerHTML=""
        const p=document.createElement("p")
        p.innerHTML=err.message
        p.style.color="red"
        div.appendChild(p)

}
})