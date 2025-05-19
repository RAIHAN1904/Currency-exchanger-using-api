const BASE_URL="https://v6.exchangerate-api.com/v6/b4a444ffde453c9535544eed/pair";

const btn = document.querySelector("form button");
const fromCurr=document.querySelector(".from select");;
const toCurr=document.querySelector(".to select");;
const msg=document.querySelector(".msg");


 


async function populateDropdowns() {
    try {
      const res = await fetch("https://v6.exchangerate-api.com/v6/b4a444ffde453c9535544eed/codes");
      const data = await res.json();
  
      if (data.result === "success") {
        const codes = data.supported_codes.map(item => item[0]);

        return codes;
      } else {
        throw new Error("Failed to fetch codes");
      }
    } catch (err) {
      console.error("Error:", err);
      return [];
    }
  }
  
  // 2. Call the function after declaration
  populateDropdowns().then(codes => {
    //console.log("Codes outside:", codes);
  
    const dropdowns = document.querySelectorAll(".select-container select");
    for (let select of dropdowns) {
      for (let currCode of codes) {
        let newOption = document.createElement("option");
        newOption.innerText = currCode;
        newOption.value = currCode;
        if(select.name=="from" && currCode=="USD"){
          newOption.selected="selected";
        }
        if(select.name=="to" && currCode=="BDT"){
          newOption.selected="selected";
        }
        select.append(newOption);
      }

      select.addEventListener("change", (evt)=>{
         updateFlag(evt.target);
      })
    }

     updateExchangeRate();
  });


   const updateFlag= (element)=>{
    let currCode=element.value;
    //console.log(currCode);
    let countryCode=countryList[currCode];
    let newSrc= `https://flagsapi.com/${countryCode}/flat/64.png`;
    let img= element.parentElement.querySelector("img");
    img.src=newSrc;
  }


  const updateExchangeRate= async()=>{
    let amount=document.querySelector(".text").value;
    
    if(amount=="" || amount<1){
      amount=1;
      amount="1";
    }

    console.log(amount);

    console.log(fromCurr.value,toCurr.value);

    const URL=`${BASE_URL}/${fromCurr.value}/${toCurr.value}`;
    
    let response= await fetch(URL);
    let data=await response.json();


    const conversionRate = data.conversion_rate;
    const tcost=amount*conversionRate;

    console.log(tcost);
    msg.innerText=`${amount}${fromCurr.value} = ${tcost}${toCurr.value}`;
  }

 btn.addEventListener("click", (evt)=>{
    evt.preventDefault();
     updateExchangeRate();
    })


