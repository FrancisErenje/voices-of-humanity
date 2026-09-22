/*
======================================
VOICES OF HUMANITY
ZONE ENGINE
======================================
*/


function loadZones(){


if(typeof CampusZones === "undefined"){

console.warn(
"✗ Zone Engine: CampusZones missing"
);

return;

}


CampusZones.forEach(zone=>{


const element=document.createElement("div");


element.className="museum-zone";


element.dataset.zoneId=zone.id;


element.style.left =
zone.x+"px";


element.style.top =
zone.y+"px";


element.style.width =
zone.width+"px";


element.style.height =
zone.height+"px";


campus.appendChild(element);


});


console.log(
"✓ Zone Engine Loaded:",
CampusZones.length,
"zones"
);


}


console.log(
"✓ Zone Engine Ready"
);