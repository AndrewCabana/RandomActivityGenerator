function reset() {
    localStorage.clear();
    console.log('reset')
  }
  
  function getActivityType() {
    var activityType = document.getElementById("activity-type").value;
    return activityType;
  }
  
  function getParticipantsValue() {
    var participants = document.getElementById("participants").value;
    return participants;
  }
  
  
  
  
  
  // set accesibility to button id 
  var buttons = document.getElementsByClassName("accessibility-button");
  for (var i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", function () {
      var accessibility = this.id;
      console.log(this.id);
  // loop through buttons give button with id accessibility selected else remove class selected
      for (var j = 0; j < buttons.length; j++) {
        if (buttons[j].id === accessibility) {
          buttons[j].classList.add("selected");
          console.log('selected')
        } else { 
          buttons[j].classList.remove("selected");
          console.log('unselected (runs x2)') 
        }
      }
    });
  }
  
  // getting accessibility 
  function getAccessibility() {
    
    var accessibility = "";
    for (var i = 0; i < buttons.length; i++) {
      if (buttons[i].classList.contains("selected")) {
        accessibility = buttons[i].id;
        console.log(accessibility)
        break;
      }
    }
    return accessibility;
  }
  
  
  document.getElementById("submit-button").addEventListener("click", function () {
    makeGetRequest();
  });
  
  
  
  
  
  
  
  // 1.find min/max   2. get request to api 3. innerHTML 
  function makeGetRequest() {
    var activityType = getActivityType();
    var participants = getParticipantsValue();
    var accessibility = getAccessibility();
    var minAccessibility = 0;
    var maxAccessibility = 0;
    if (accessibility === 'easy') {
      minAccessibility = 0;
      maxAccessibility = 0.3;
    } else if (accessibility === 'medium') {
      minAccessibility = 0.3;
      maxAccessibility = 0.6;
    } else if (accessibility === 'hard') {
      minAccessibility = 0.6;
      maxAccessibility = 1;
    }
    fetch("https://www.boredapi.com/api/activity?type=" + activityType + "&minaccessibility=" + minAccessibility + "&maxaccessibility=" + maxAccessibility + "&participants=" + participants)
      .then(response => response.json())
      .then(data => {
  
        console.log(data)
        if (data.error) {
          document.getElementById("activity-container").innerHTML =
            "<h2>No Activity Found!</h2>" + "<h3>Adjust Activity Filters</h3>"
          console.log('error')
        } else {
          document.getElementById("activity-container").innerHTML =
             "<h2>Activity</h2><p>" + data.activity + "</p>" + "<br/>"
            + "<h2>Activity Type</h2><p>" + data.type + "</p>"
            + "<h2>Participants</h2><p>" + data.participants + "</p>"
            + "<h2>Accessibility </h2><p>" + data.accessibility + "</p>";
  
  
            showSaveBtn()
          
          document.getElementById("save-button").addEventListener("click", function () {
            let savedActivities = JSON.parse(localStorage.getItem("savedActivities")) ;  // get item saved actvivites parse to obj OR create array if pasred = null or falsey 
  
            if(savedActivities.length >= 4 ) { // check array length 
              savedActivities.splice(0, 1);  
            }
            savedActivities.push(data); // push data to saved activy array
  
            localStorage.setItem("savedActivities", JSON.stringify(savedActivities));
  
            console.log(`activity saved: ${data.activity}`);
            console.log(savedActivities);
          });
        }
      })
      .catch(error => console.error(error));
  
  };
  
  
  
  const modalWindow = document.getElementById("modal-container");
  
  if(localStorage.getItem("hasSeenModal")){
    modalWindow.style.visibility = "hidden";
  } else {
    modalWindow.style.visibility = "visible";
  }
  
  function hideModal (){
    localStorage.setItem('hasSeenModal', 'true');
    modalWindow.style.visibility = "hidden";
    
  }
  
  const saveBtn = document.getElementById('hidden-btn');
  saveBtn.style.visibility = "hidden";
  
  function showSaveBtn(){
    saveBtn.style.visibility = "visible";
  }
  
  document.getElementById('buttonForClose').addEventListener('click', function(){
    document.getElementById("activity-container").innerHTML = ""
    saveBtn.style.visibility = "hidden";
  })
  
  