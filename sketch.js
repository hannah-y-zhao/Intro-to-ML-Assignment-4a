let vid;
let handModel, handData, thumb, index, middle, ring, pinky;
let diam = 10;
let myNN, myNNresults;
let instructions, startBttn, trainBttn, saveBttn;
let lineY;
let collectData = false;
let popupArr=[]

let numPops;

function setup() {
  createCanvas(640, 480);
  vid = createCapture(VIDEO);
  vid.size(width, height);
  vid.hide();

  instructions = createP("Press the button to start collecting data. For best results, hold up your pointer finger first, and slowly add fingers. Make sure your fingertips are above the white line!");
  instructions.position(width + 20, 0);

  startBttn = createButton("START");
  startBttn.position(width / 2 - startBttn.width / 2, height - 20 - startBttn.height);
  startBttn.mousePressed(startDataCollect);

  trainBttn = createButton("TRAIN DATA");
  trainBttn.position(width / 2 - trainBttn.width / 2, height - 20 - trainBttn.height);
  trainBttn.mousePressed(trainData);
  trainBttn.hide();

  saveBttn = createButton("SAVE MODEL");
  saveBttn.position(width / 2 - saveBttn.width / 2, height - 20 - saveBttn.height);
  saveBttn.mousePressed(saveModel);
  saveBttn.hide();

  lineY = height * 2 / 3;

  rectMode(CENTER);
  noStroke();

  handModel = ml5.handpose(vid, modelLoaded);
  handModel.on("hand", gotPose);

  const option = {
    task: "classification",
    debug: true,
  };
  myNN = ml5.neuralNetwork(option);
}

function modelLoaded() {
  console.log("handModel: " + handModel);
}

function gotPose(results) {
  handData = results;
  if (results.length > 0) {
    // console.log("results: " + results);
    index = results[0].annotations.indexFinger[3];
    thumb = results[0].annotations.thumb[3];
    middle = results[0].annotations.middleFinger[3];
    ring = results[0].annotations.ringFinger[3];
    pinky = results[0].annotations.pinky[3];
  }

}

function draw() {
  const flipped = ml5.flipImage(vid)
  if (flipped) {
    image(flipped, 0, 0);

  }

  if (handData && handData.length > 0) {
    noStroke()
    fill("red");
    circle(width - thumb[0], thumb[1], diam);

    fill("orange");
    circle(width - index[0], index[1], diam);

    fill("yellow");
    circle(width - middle[0], middle[1], diam);

    fill("green");
    circle(width - ring[0], ring[1], diam);

    fill("blue");
    circle(width - pinky[0], pinky[1], diam);

  }
  dataCollect();

  stroke("white");
  strokeWeight(3);
  line(0, lineY, width, lineY);

  if (myNNresults) {
    noStroke()
    textSize(20);
    fill("white")
    text(myNNresults[0].label + ', ' + myNNresults[0].confidence, width / 2, height * 1 / 4, width * 3 / 4, height / 2);
  
    // if(myNNresults[0].label == 'none'){
    //   numPops=0

    // }else if (myNNresults[0].label == 'indexMiddleRingPinkyThumb'){
    //   numPops=5
    // }else if (myNNresults[0].label == 'indexMiddleRingPinky'){
    //   numPops=4
    // }else if (myNNresults[0].label == 'indexMiddleRing'){
    //   numPops=3
    // }else if (myNNresults[0].label == 'indexMiddle'){
    //   numPops=2
    // }else if (myNNresults[0].label == 'index'){
    //   numPops=1
    // }
    // // else if (myNNresults[0].label == 'thumbsUp'){
    // //   fill('green')
    // //   rect(0,0,width,height)
    // //   noLoop()
    // // }
    // if (numPops>0){
    //   for (i=0; i<numPops; i++){
    //     popupArr=[]
    //     popupArr.push(new Popup(width*1/4+i*20,height*1/4+i*20))
        
    //   }
    // }
    // if (popupArr.length>0){
    //   for (i=0; i<popupArr; i++){
    //     popupArr[i].display()
    //   }
    // }
  }
}

function displayPopup(){
  if (popupArr.length>0){
    for (i=0; i<popupArr; i++){
      popupArr[i].display()
    }
  }
}

function startDataCollect() {
  collectData = true;
  startBttn.hide();


  trainBttn.show();
}

function dataCollect() {
  if (collectData == true) {
    if (handData.length > 0) {
      if (thumb[1] >= lineY && index[1] >= lineY && middle[1] >= lineY && ring[1] >= lineY && pinky[1] >= lineY) {
        console.log('none')
        const data = [thumb[0], thumb[1], index[0], index[1], middle[0], middle[1], ring[0], ring[1], pinky[0], pinky[1]];
        myNN.addData(data, ['none']);
      }
      else if (thumb[1] <= lineY && index[1] <= lineY && middle[1] <= lineY && ring[1] <= lineY && pinky[1] <= lineY) {
        console.log('indexMiddleRingPinkyThumb')
        const data = [thumb[0], thumb[1], index[0], index[1], middle[0], middle[1], ring[0], ring[1], pinky[0], pinky[1]];
        myNN.addData(data, ['indexMiddleRingPinkyThumb']);
      }
      else if (thumb[1] >= lineY && index[1] <= lineY && middle[1] <= lineY && ring[1] <= lineY && pinky[1] <= lineY) {
        console.log('indexMiddleRingPinky');
        const data = [thumb[0], thumb[1], index[0], index[1], middle[0], middle[1], ring[0], ring[1], pinky[0], pinky[1]];
        myNN.addData(data, ['indexMiddleRingPinky']);
      }
      else if (thumb[1] >= lineY && index[1] <= lineY && middle[1] <= lineY && ring[1] <= lineY && pinky[1] >= lineY) {
        console.log('indexMiddleRing');
        const data = [thumb[0], thumb[1], index[0], index[1], middle[0], middle[1], ring[0], ring[1], pinky[0], pinky[1]];
        myNN.addData(data, ['indexMiddleRing']);
      }
      else if (thumb[1] >= lineY && index[1] <= lineY && middle[1] <= lineY && ring[1] >= lineY && pinky[1] >= lineY) {
        console.log('indexMiddle');
        const data = [thumb[0], thumb[1], index[0], index[1], middle[0], middle[1], ring[0], ring[1], pinky[0], pinky[1]];
        myNN.addData(data, ['indexMiddle']);
      }
      else if (thumb[1] >= lineY && index[1] <= lineY && middle[1] >= lineY && ring[1] >= lineY && pinky[1] >= lineY) {
        console.log('index');
        const data = [thumb[0], thumb[1], index[0], index[1], middle[0], middle[1], ring[0], ring[1], pinky[0], pinky[1]];
        myNN.addData(data, ['index']);
      }
      else if (thumb[1] <= lineY && index[1] >= lineY && middle[1] >= lineY && ring[1] >= lineY && pinky[1] >= lineY) {
        console.log('thumbs up');
        const data = [thumb[0], thumb[1], index[0], index[1], middle[0], middle[1], ring[0], ring[1], pinky[0], pinky[1]];
        myNN.addData(data, ['thumbsUp']);
      }
    }

  }
  else if (collectData == false) {
    // console.log("false");
  }
}

function trainData() {
  collectData = false;
  myNN.normalizeData();
  myNN.train({ epochs: 50 }, classify);
  trainBttn.hide();
  saveBttn.show();
}

function classify() {
  const data = [thumb[0], thumb[1], index[0], index[1], middle[0], middle[1], ring[0], ring[1], pinky[0], pinky[1]];
  myNN.classify(data, gotNNResults);
}

function gotNNResults(err, results) {
  if (err) {
    console.log(err);
  }
  if (results) {
    // console.log(results);
    myNNresults = results;
    classify();
  }
}

function saveModel() {
  myNN.save("numFingersModel");
}