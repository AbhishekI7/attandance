$(document).ready(function () {

    function getCookie(name) {
      let value = `; ${document.cookie}`;
      let parts = value.split(`; ${name}=`);
      if (parts.length === 2) return decodeURIComponent(parts.pop().split(';').shift());
    }
  
    var cookieData = getCookie("attendanceData");
    if (cookieData) {
      cookieData = cookieData.replace(/\n/g, '<br>');
      $("#display-div").html(cookieData);
    }
  
    $("#toggle-button").click(function() {
      var $displayDiv = $("#display-div");
      if ($displayDiv.is(":visible")) {
          $displayDiv.slideUp();
      } else {
          $displayDiv.slideDown();
      }
    });
  
    function getQueryParams() {
      var params = {};
      window.location.search
        .substring(1)
        .split("&")
        .forEach(function (pair) {
          var keyValue = pair.split("=");
          params[keyValue[0]] = keyValue[1];
        });
      return params;
    }
  
    var svg_check = `
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2ZM15.5354 8.38136L10.5856 13.3311L8.46431 11.2098C8.07379 10.8193 7.44063 10.8193 7.0501 11.2098C6.65958 11.6003 6.65958 12.2335 7.0501 12.624L9.80782 15.3817C10.2374 15.8113 10.9339 15.8113 11.3635 15.3817L16.9496 9.79557C17.3401 9.40505 17.3401 8.77188 16.9496 8.38136C16.5591 7.99083 15.9259 7.99083 15.5354 8.38136Z" fill="#00AB08"/>
</svg>`; // Keep your SVGs as-is
    var svg_uncheck = `
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2ZM9.87874 8.46443C9.48821 8.07391 8.85505 8.07391 8.46452 8.46443C8.10404 8.82492 8.07631 9.39215 8.38133 9.78443L8.46452 9.87864L10.5858 11.9999L8.46443 14.1213C8.07391 14.5118 8.07391 15.145 8.46443 15.5355C8.82492 15.896 9.39215 15.9237 9.78443 15.6187L9.87864 15.5355L12 13.4141L14.1214 15.5355C14.5119 15.926 15.1451 15.926 15.5356 15.5355C15.8961 15.175 15.9238 14.6078 15.6188 14.2155L15.5356 14.1213L13.4142 11.9999L15.5355 9.87862C15.926 9.4881 15.926 8.85493 15.5355 8.46441C15.175 8.10392 14.6078 8.07619 14.2155 8.38122L14.1213 8.46441L12 10.5857L9.87874 8.46443Z" fill="#FF4D4D"/>
</svg>`;
  
    function capitalizeWords(str) {
      return str.toLowerCase().replace(/\b\w/g, function (char) {
        return char.toUpperCase();
      });
    }
  
    var queryParams = getQueryParams();
    if (queryParams.section) {
      $("#display-div").hide();
      $.getJSON(queryParams.section + ".json", function (data) {
        data.forEach(function (student, index) {
          var studentDiv = `
            <div class="${student["roll-number"]} student P">
                <p class="att">${svg_check}</p>
                <p>${student["roll-number"]}</p>
                <p>${capitalizeWords(student.name)}</p>
            </div>`;
          var $studentElement = $(studentDiv).hide();
          setTimeout(function() {
            $(".table-data").append($studentElement);
            $studentElement.slideDown();
          }, index * 20);
        });
      });
      $("#button-container").hide();
    } else {
      $("#select").hide();
      $("#unselect").hide();
      $("#attendance-table").hide();
      $("#copy-button").hide();
      $("#share-button").hide();
    }
  
    $(".table-data").on("click", ".student", function (event) {
      $(event.currentTarget).toggleClass("A P");
      $(this)
        .find(".att")
        .html($(event.currentTarget).hasClass("A") ? svg_uncheck : svg_check);
    });
  
    $("#select").click(function () {
      $(".A").removeClass("A");
      $(".student").addClass("P");
      $(".P .att").html(svg_check);
    });
  
    $("#unselect").click(function () {
      $(".P").removeClass("P");
      $(".student").addClass("A");
      $(".A .att").html(svg_uncheck);
    });
  
    var date = new Date();
    function getDaySuffix(day) {
      if (day > 3 && day < 21) return "th";
      switch (day % 10) {
        case 1: return "st";
        case 2: return "nd";
        case 3: return "rd";
        default: return "th";
      }
    }
  
    function formatDate(date) {
      var day = date.getDate();
      var month = date.toLocaleString("en-GB", { month: "long" });
      var year = date.getFullYear();
      var formattedDate = `${day}${getDaySuffix(day)} ${month} ${year}`;
      var hours = date.getHours();
      var minutes = date.getMinutes();
      var ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12;
      if (hours === 0) hours = 12;
      var formattedTime = `${hours}:${minutes.toString().padStart(2, "0")} ${ampm}`;
      var morningOrAfternoon = date.getHours() < 12 ? "Morning" : "Afternoon";
      return { formattedDate, formattedTime, morningOrAfternoon };
    }
  
    function getAttendese() {
      var selectedRollNumbers = [];
      $(".P").each(function () {
        var classtest = $(this).attr("class").split(" ")[0].slice(-2);
        if ($(this).attr("class").split(" ")[0].substring(0, 2) == 24) {
          classtest = 'LE-' + classtest;
        }
        selectedRollNumbers.push(classtest);
      });
  
      var unselectedRollNumbers = [];
      $(".A").each(function () {
        var classtest = $(this).attr("class").split(" ")[0].slice(-2);
        if ($(this).attr("class").split(" ")[0].substring(0, 2) == 24) {
          classtest = 'LE-' + classtest;
        }
        unselectedRollNumbers.push(classtest);
      });
  
      return { selectedRollNumbers, unselectedRollNumbers };
    }
  
    function generateTextToCopy() {
      var { selectedRollNumbers, unselectedRollNumbers } = getAttendese();
      var total = selectedRollNumbers.length + unselectedRollNumbers.length;
      var percentage = total === 0 ? 0 : ((selectedRollNumbers.length / total) * 100).toFixed(2);
  
      var { formattedDate, formattedTime, morningOrAfternoon } = formatDate(date);
      return `${getQueryParams().section.replace(/-/g, ' ')} Attendance ${formattedDate} \n${morningOrAfternoon} ${formattedTime} \nPresent (${selectedRollNumbers.length}/${total}) - ${percentage}%: \n${selectedRollNumbers.join(", ")}.\n\nAbsent (${unselectedRollNumbers.length}):\n${unselectedRollNumbers.join(", ")}.`;
    }
  
    $("#copy-button").click(function () {
      var textToCopy = generateTextToCopy();
  
      var existingData = getCookie("attendanceData");
      var updatedData = existingData ? existingData + "\n\n" + textToCopy : textToCopy;
      document.cookie = "attendanceData=" + encodeURIComponent(updatedData) + "; path=/";
  
      $("#display-div").html(updatedData.replace(/\n/g, '<br>'));
  
      navigator.clipboard.writeText(textToCopy)
        .then(function () {
          alert("Copied roll numbers to clipboard!");
        })
        .catch(function (err) {
          console.error("Failed to copy: ", err);
        });
    });
  
    $("#share-button").on("click", function () {
      var textToCopy = generateTextToCopy();
      var whatsappURL = "https://wa.me/?text=" + encodeURIComponent(textToCopy);
  
      var existingData = getCookie("attendanceData");
      var updatedData = existingData ? existingData + "\n\n" + textToCopy : textToCopy;
      document.cookie = "attendanceData=" + encodeURIComponent(updatedData) + "; path=/";
  
      $("#display-div").html(updatedData.replace(/\n/g, '<br>'));
      window.open(whatsappURL, "_blank");
    });
  
  });
  