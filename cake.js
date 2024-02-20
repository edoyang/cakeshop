window.onload = function() {
  loadXMLDoc();
}

function loadXMLDoc() {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      window.xmlData = this;
      displayCakes(this);
      generateFilters(this);
      updateCategoryCounts(this);
      initializeCakeClickEvents();
    }
  };
  xmlhttp.open("GET", "data.xml", true);
  xmlhttp.send();
}

function showCakeDetails(cake) {
  var overlay = document.getElementById('cake-overlay') || createOverlay();
  var details = document.getElementById('cake-details') || createDetailsContainer();

  // Populate details based on the clicked cake, assuming your corrected innerHTML assignment
  details.innerHTML = `<div class="pic"><img src="${cake.querySelector('.pic img').src}" alt="${cake.querySelector('.cake-heading').textContent}" /></div>
                       <h2>${cake.querySelector('.cake-heading').textContent}</h2>
                       <p>${cake.querySelector('.cake-price').textContent}</p>
                       <p>${cake.querySelector('.cake-description').textContent}</p>
                       <button onclick="hideCakeDetails()">Close</button>`;

  // Prepare elements for animation
  overlay.style.opacity = 0;
  details.style.opacity = 0;
  details.style.transform = 'translate(-50%, -50%) scale(0.5)';

  // Ensure elements are visible
  overlay.style.display = 'block';
  details.style.display = 'block';

  // Force reflow to ensure transitions are triggered
  details.offsetHeight;

  // Apply final styles to trigger the transition
  overlay.style.opacity = 1;
  details.style.opacity = 1;
  details.style.transform = 'translate(-50%, -50%) scale(1)';
}

function hideCakeDetails() {
  var overlay = document.getElementById('cake-overlay');
  var details = document.getElementById('cake-details');

  // Start the hide transition
  overlay.style.opacity = 0;
  details.style.opacity = 0;
  details.style.transform = 'translate(-50%, -50%) scale(0.5)';

  // Wait for the transition to finish before hiding the elements
  setTimeout(() => {
      overlay.style.display = 'none';
      details.style.display = 'none';
  }, 500); // Match the duration of the CSS transition
}

function createOverlay() {
  var overlay = document.createElement('div');
  overlay.id = 'cake-overlay';
  overlay.className = 'cake-active';
  overlay.addEventListener('click', hideCakeDetails);
  document.body.appendChild(overlay);
  return overlay;
}

function createDetailsContainer() {
  var details = document.createElement('div');
  details.id = 'cake-details';
  details.className = 'cake-active-content';
  document.body.appendChild(details);
  return details;
}

function hideCakeDetails() {
  document.getElementById('cake-overlay').style.display = 'none';
  document.getElementById('cake-details').style.display = 'none';
}

function updateCategoryCounts(xml) {
  var xmlDoc = xml.responseXML;
  var cakes = xmlDoc.getElementsByTagName("cake");
  var categoryCounts = { 'Birthday': 0, 'Wedding': 0, 'Any': 0 };
  var totalCount = 0; 

  for (var i = 0; i < cakes.length; i++) {
      var category = cakes[i].getAttribute("category");
      totalCount++;

      if (categoryCounts.hasOwnProperty(category)) {
          categoryCounts[category]++;
      }
  }

  function updateCategoryHTML(className, count) {
    var categoryElements = document.querySelectorAll('.' + className + ' p'); // Select all <p> tags within the given class
    categoryElements.forEach(function(element) {
        element.textContent = `(${count} cakes)`; // Update text content
    });
}

  updateCategoryHTML('birthday-cake', categoryCounts['Birthday']);
  updateCategoryHTML('wedding-cake', categoryCounts['Wedding']);
  updateCategoryHTML('any-cake', categoryCounts['Any']);
  updateCategoryHTML('browse', totalCount); 
}
  
function displayCakes(xml, filterFlavor = null) {
  var xmlDoc = xml.responseXML;
  var cakes = xmlDoc.getElementsByTagName("cake");
  var html = "";
  for (var i = 0; i < cakes.length; i++) {
    let flavor = cakes[i].getElementsByTagName("filter")[0].getElementsByTagName("flavor")[0].childNodes[0].nodeValue;

    if (filterFlavor !== null && filterFlavor !== flavor) continue;

    let category = cakes[i].getAttribute("category");
    let imgSrc = cakes[i].getElementsByTagName("img")[0].getAttribute("src");
    let heading = cakes[i].getElementsByTagName("heading")[0].childNodes[0].nodeValue;
    let price = cakes[i].getElementsByTagName("price")[0].childNodes[0].nodeValue;
    let description = cakes[i].getElementsByTagName("description")[0].childNodes[0].nodeValue;

    html += `<div class="cake" category="${category}" flavor="${flavor}">
              <div class="pic"><img src="${imgSrc}" alt="${heading}" /></div>
              <h2 class="cake-heading">${heading}</h2>
              <p class="cake-price">Price: ${price}</p>
              <p class="cake-description">Description: ${description}</p>
            </div><br>`;
  }
  document.getElementById("demo").innerHTML = html;
  // Re-initialize click events whenever cakes are displayed/filtered
  initializeCakeClickEvents();
}

function initializeCakeClickEvents() {
  var cakes = document.querySelectorAll('.cake');
  cakes.forEach(cake => {
    cake.addEventListener('click', function() {
      showCakeDetails(cake);
    });
  });
}
  
function generateFilters(xml) {
  var xmlDoc = xml.responseXML;
  var flavors = xmlDoc.getElementsByTagName("flavor");
  var uniqueFlavors = Array.from(new Set(Array.prototype.map.call(flavors, el => el.childNodes[0].nodeValue)));

  var filterHTML = 'Filter by flavor: <select id="flavorFilter" onchange="filterCakes(window.xmlData)"><option value="all">All</option>';
  uniqueFlavors.forEach(flavor => {
    filterHTML += `<option value="${flavor}">${flavor}</option>`;
  });
  filterHTML += '</select>';

  document.getElementById("filters").innerHTML = filterHTML;
}

function filterCakes(xml) {
  var filterValue = document.getElementById("flavorFilter").value;
  if (filterValue === "all") {
    displayCakes(xml);
  } else {
    displayCakes(xml, filterValue);
  }
}