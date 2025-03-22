$(function () {
    /*global Taylor variable/ because of time 
    i have not been able to use OOP archtecture(which is my all time coding model) so i will
     decalare Taylor as global to this document so i can use it whenever i want*/
     var Taylor;
    //auth tokens
    const username = "coalition";
    const password = "skills-test";
    const auth = btoa("" + username + ":" + password)
    var co_dataApi = "https://fedskillstest.coalitiontechnologies.workers.dev"
   //try fetching the data from coalition DataApi as instructed, i will use the new HTML5 FetchAPI
    fetch(`${co_dataApi}`, {
        headers : {
		'Authorization': `Basic ${auth}`,
        'Content-Type' : 'application/json'
        }
	}).then(response => {
        if (response.ok) {
            //we must convert it to js Object for easy reading
            return response.json();
        }
    }).then(data => {
        //iterating users for starting page updation
        $("#mainNav ul").remove();
        $("#mainNav").append("<ul class='flex flex-col items-start row-start-2 justify-start'></ul>");
        var patientholder = "";
        data.forEach(patient => {
        if(patient.name === "Jessica Taylor") {
            // here we store this specific user to global Taylor variable for late use
             Taylor = patient;
            patientholder += 
            `<li class="grid jessica_taylor grid-rows-1 gap-3 grid-cols-7 p-5" id="jessica_taylor">
    <img class="rounded-full w-full" src="${patient.profile_picture}" alt="Mrs. Wambele" />
    <p class="flex flex-col col-start-2 col-end-7 font-bold">Mrs. Wambele<br>
    <span>${patient.gender}, ${patient.age}</span></p>
    <img src="img/icons8-3-dots-50.png" class="dotNav"/>
    </li>`
        } else {
            //continue displaying other users

            patientholder += 
            `
    <li class="grid grid-rows-1 gap-3 grid-cols-7 p-5">
    <img class="rounded-full w-full" src="${patient.profile_picture}" alt="${patient.name}" />
    <p class="flex flex-col col-start-2 col-end-7">${patient.name}<br>
    <span>${patient.gender}, ${patient.age}</span></p>
    <img src="img/icons8-3-dots-50.png" class="dotNav"/>
    </li>`
        }
        });
        //attach all users to their required DOM
        $("#mainNav ul").html(patientholder);
    }).catch(error => {
      alert("it seems that https://fedskillstest.coalitiontechnologies.workers does not respond")
        console.log(error);
    });

    //Initiating displaying of data using $ click even on required user
    currentChart="";
   $("#mainNav").on('click','#jessica_taylor', function() {
    //creating chart object 
    currentChart.destroy();
    patient_chart = new Chart(document.getElementById("patient-chart"), {
        type: 'line',
        data: {
          labels: ["oct 2023","nov, 2023","dec, 2023","jan, 2024","feb, 2024", "mar, 2024"],
          datasets: [{ 
              data: [],
              label: "diastolic",
              borderColor: "#7E6CAB",
              fill: false,
              lineTension: 0.5
            }, { 
              data: [],
              label: "systolic",
              borderColor: "#E66FD2",
              fill: false,
              lineTension: 0.5
            }
          ]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                display: true,
                text: 'Diagnosis History',
                color: 'black',
                position: 'top',
                align: 'start',
          }
        }
        }
      });
      //declaring and update chart dataAttrs from dataApi result to update our chart object

      let newDiastolic = []
      let newSystolic = []
    for (let i = 0; i < 6; i += 1) {
    newDiastolic.push(Taylor.diagnosis_history[i].blood_pressure.diastolic.value)
    newSystolic.push(Taylor.diagnosis_history[i].blood_pressure.systolic.value)
    }
    newDiastolic = newDiastolic.reverse();
    newSystolic = newSystolic.reverse()
    console.log(Taylor)
    console.log(newSystolic)
    patient_chart.data.datasets[0].data = newDiastolic;
    patient_chart.data.datasets[1].data = newSystolic;
    patient_chart.update();
    patient = Taylor;
    $(this).css("background","rgba(0,0,255,.2)").css("border-radius", "1em")
    fillClickedPatient();
         })

 /*this is the separate function which continue to update user interface data of Patient,
  the variables are self explanatory*/

    function fillClickedPatient(){
        //declaring local variable patient so that function can be used to update any user
        var patient = Taylor

        $("#ppd").html(
             
  `<ul>  <li>
  <img class="profile w-3" src="${patient.profile_picture}" /><p>${patient.name}</p></li>
</ul>
<ul class="flex flex-col gap-3">
 <li class="flex flex-row gap-2"><img class="icon" width="30" src="img/schedule.png" /><p>Date Of Birth <br>
     <span>${patient.date_of_birth}</span></p>
 <li>
     <li  class="flex flex-row gap-2"><img class="icon" width="30" src="img/gender.png" /><p>Gender<br>
         <span>${patient.gender}</span></p>
     <li>
         <li  class="flex flex-row gap-2"><img class="icon" width="30" src="img/contact.png" /><p>Contact Info.<br>
             <span>${patient.phone_number}</span></p>
         <li>
             <li  class="flex flex-row gap-2"><img class="icon" width="30" src="img/contacts.png" /><p>Emmergence Contacts<br>
                 <span>${patient.emergency_contact}</span></p>
             <li>
             <li  class="flex flex-row gap-2"><img class="icon" width="30" src="img/insurance.png" /><p>Insuarance Provider<br>
                 <span>${patient.insurance_type}</span></p>
             <li>
             <li class="text-blue-600"><button type="button" > more information  &gt; &gt; &gt;</button></li>
</ul>`)
   $(".info-diastolic").html(patient.diagnosis_history[0].blood_pressure.diastolic.value);
   $(".info-diastolic-level").html(patient.diagnosis_history[0].blood_pressure.diastolic.levels);
   
   $(".info-systolic").html(patient.diagnosis_history[0].blood_pressure.systolic.value);
   $(".info-systolic-level").html(patient.diagnosis_history[0].blood_pressure.systolic.levels);
   
   $(".info-respiratory").html(patient.diagnosis_history[0].respiratory_rate.value + " bpm");
   $(".info-respiratory-level").html(patient.diagnosis_history[0].respiratory_rate.levels);
   
   $(".info-heart-rate").html(patient.diagnosis_history[0].heart_rate.value + " bpm");
   $(".info-heart-rate-level").html(patient.diagnosis_history[0].heart_rate.levels);

   
   $(".info-temperature").html(patient.diagnosis_history[0].temperature.value + " &#176 F");
   $(".info-temperature-level").html(patient.diagnosis_history[0].temperature.levels);
   patient.diagnostic_list.forEach(diagnosis => {
    $("table").append(`
      <tr>
        <td>${diagnosis.name}</td>
        <td>${diagnosis.description}</td>
        <td>${diagnosis.status}</td>
      </tr>`);
   })
   patient.lab_results.forEach(lab_result => {
    if(lab_result === "CT Scans"){
        $("#pageFooter2").append(`
            <a style="background-color: rgba(0,0,255,.2) w-full">${lab_result}  <i class="material-icons">download</i></a>`)
       
    } else {
    $("#pageFooter2").append(`
        <a>${lab_result}  <i class="material-icons">download</i></a>`)
    }
    })
    }
     currentChart = new Chart(document.getElementById("patient-chart"), {
        type: 'line',
        data: {
          labels: ["oct 2023","nov, 2023","dec, 2023","jan, 2024","feb, 2024", "mar, 2024"],
          datasets: [{ 
              data: [100,900,2000],
              label: "diastolic",
              borderColor: "#7E6CAB",
              fill: false,
              lineTension: 0.5
            }, { 
              data: [200,3000],
              label: "systolic",
              borderColor: "#E66FD2",
              fill: false,
              lineTension: 0.5
            }
          ]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                display: true,
                text: 'Diagnosis History',
                color: 'black',
                position: 'top',
                align: 'start',
          }
        }
        }
      });
      $("#mainNav").click(function(){
        $("#mainArticle").show();
      })
      $('#transactions').click( ()=> {                    
           $("#page2").slideDown();   
           $(document).scrollTop(0);
     }); 
     $('#page2').on("click", ()=> {                    
          $("#page2").slideUp();   
          $(document).scrollTop(0);
    }); 
    /* THIS SOFTWARE WAS CREATED BY JOSEPH WAMBURA FOR CONTEST PURPOSE ONLY  AT TANAIR*/
});