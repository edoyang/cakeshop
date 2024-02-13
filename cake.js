window.onload = function() {
    loadXMLDoc();
  }
  
  function loadXMLDoc() {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        displayCakes(this);
        generateFilters(this);
      }
    };
    xmlhttp.open("GET", "data.xml", true);
    xmlhttp.send();
  }
  
  function displayCakes(xml) {
    var i, xmlDoc, cake, html = "";
    xmlDoc = xml.responseXML;
    cake = xmlDoc.getElementsByTagName("cake");
    for (i = 0; i < cake.length; i++) {
      let category = cake[i].getAttribute("category");
      let imgSrc = cake[i].getElementsByTagName("img")[0].getAttribute("src");
      let heading = cake[i].getElementsByTagName("heading")[0].childNodes[0].nodeValue;
      let price = cake[i].getElementsByTagName("price")[0].childNodes[0].nodeValue;
      let description = cake[i].getElementsByTagName("description")[0].childNodes[0].nodeValue;
      let flavor = cake[i].getElementsByTagName("filter")[0].getElementsByTagName("flavor")[0].childNodes[0].nodeValue;
  
      html += `<div class="cake" category="${category}" flavor="${flavor}">
                <div class="pic"><img src="${imgSrc}" alt="${heading}"></div>
                <h2>${heading}</h2>
                <p>Price: ${price}</p>
                <p>Description: ${description}</p>
              </div><br>`;
    }
    document.getElementById("demo").innerHTML = html;
  }
  
  function generateFilters(xml) {
    var xmlDoc = xml.responseXML;
    var flavors = xmlDoc.getElementsByTagName("flavor");
    var uniqueFlavors = Array.from(new Set(Array.prototype.map.call(flavors, function(el) { return el.childNodes[0].nodeValue; })));
    
    var filterHTML = 'Filter by flavor: <select id="flavorFilter" onchange="filterCakes()"><option value="all">All</option>';
    uniqueFlavors.forEach(function(flavor) {
      filterHTML += `<option value="${flavor}">${flavor}</option>`;
    });
    filterHTML += '</select>';
    
    document.getElementById("filters").innerHTML = filterHTML;
  }
  
  function filterCakes() {
    var filterValue = document.getElementById("flavorFilter").value;
    var cakes = document.getElementsByClassName("cake");
    Array.prototype.forEach.call(cakes, function(cake) {
      if (filterValue === "all" || cake.getAttribute("flavor") === filterValue) {
        cake.style.display = "";
      } else {
        cake.style.display = "none";
      }
    });
  }