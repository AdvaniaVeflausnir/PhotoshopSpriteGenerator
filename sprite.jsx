var log = "";
var spriteLayerArray = [];
var colWidth = 32;
var spriteWidth = 20; // columns
var spriteHeight = 60; // lines
var martrixPointer = { x:0, y:0 };
var spriteDoc = undefined;
var targetDoc = undefined;

// assumes that the target doc is active
function traverseBranch(set) {s
	log += "traversing: " + set.length + "\n";
	for(var i = set.length - 1; i >= 0 ; i--){
		var layer = set[i];
		if(layer.visible){
			if((layer instanceof ArtLayer) && layer.name.indexOf("sprite") > -1 && !layer.isBackgroundLayer ){
				log += "ArtLayer: " + layer.name + "\n";
				log += "pos: " + layer.bounds + "\n";
				app.activeDocument = targetDoc;
				var spriteLayer = layer.duplicate(spriteDoc,ElementPlacement.PLACEBEFORE.beforeLayer);
				alert(spriteLayer.bounds);
				spriteLayerArray.push({
					layer:spriteLayer,
					origo: { x:spriteLayer.bounds[0], y:spriteLayer.bounds[1] },
					width: Math.ceil((spriteLayer.bounds[2] - spriteLayer.bounds[0])/colWidth),
					height: Math.ceil((spriteLayer.bounds[3] - spriteLayer.bounds[1])/colWidth)
				});
			}
			else if(typeof(layer.layers) !== "undefined"){
				log += "LayerSet: " + layer.name + "\n";
				traverseBranch(layer.layers);
			}
		}
	}
}

function position(){
	var array = spriteLayerArray.sort(function(a, b) { return a.height - b.height; });

	var gridPointer = { x:0, y:0 };
	var currentBarHeight = 0;
	for(var i = 0; i < array.length; i++){
		var item = array[i];
		alert("h: " + item.height + " w: " + item.width);
		if(currentBarHeight != item.height) {
			currentBarHeight = item.height;
			gridPointer.y += item.height;
		} else if(gridPointer.x + item.width > spriteWidth) {
			gridPointer.y += item.height;
		}

		app.activeDocument = spriteDoc;

		try {
			item.layer.translate(-item.origo.x + gridPointer.x * colWidth,-item.origo.y + gridPointer.y * colWidth);
		} catch(err){}

		app.activeDocument = targetDoc;

		gridPointer.x += item.width;
	}
}

function traverseTree() {
	preferences.rulerUnits = Units.PIXELS;
	targetDoc = app.activeDocument;

	if(app.documents.length <= 0){
		alert("We needz docz.")
		return; 
	}

	if(targetDoc === undefined) {
		alert("We needz active docz.");
		return;
	}

	colWidth = Number( prompt('Enter width of columns, default 32px', 32) );

	spriteDoc = app.documents.add(colWidth*spriteWidth,colWidth*spriteHeight,72,"docRef",NewDocumentMode.RGB);

	var file = new File("C:\\tmp\\landsnet.less");
	traverseBranch(targetDoc.layers);
}


traverseTree();
position();
alert(log);