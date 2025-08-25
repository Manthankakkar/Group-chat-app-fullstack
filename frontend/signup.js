
const div=document.getElementById("div")
const button=document.getElementById("submitbutton")
button.addEventListener("click",async(e)=>{
try{
    e.preventDefault()
    const name=document.getElementById("name").value.trim()
    const email=document.getElementById("email").value.trim()
    const phonenumber=document.getElementById("phonenumber").value.trim()
    const password=document.getElementById("password").value.trim()
    if (name==""||email==""||phonenumber==""||password==""){
        div.innerHTML=""
       const p=document.createElement("p")
       p.innerHTML="fields cant be empty"
       p.style.color="red"
       div.appendChild(p)
       return
    }
    const res=await axios.post('http://localhost:3000/api/user/signup',{name,email,phonenumber,password})
    if (res.data.success==true){
        div.innerHTML=""
        const p=document.createElement("p")
        p.innerHTML="user registered successfully"
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