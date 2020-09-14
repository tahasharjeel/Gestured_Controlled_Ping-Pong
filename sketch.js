let poseNet;
let video;
let hit = new Audio();
let wall = new Audio();
let userScore = new Audio();
let aiScore = new Audio();
let play = false;
let width = 640;
let height = 450;

const ball = {
  x: width / 2,
  y: height / 2,
  radius: 15,
  xVelocity: 5,
  yVelocity: 5,
  color: "#ffc7c7",
  speed: 7
}

const user = {
  x: 0,
  y: 200,
  height: 100,
  width: 20,
  score: 0,
  color: "#ffc7c7"
}

const ai = {
  x: 620,
  y: 200,
  height: 100,
  width: 20,
  score: 0,
  color: "#ffc7c7"
}

const net = {
  x: (width - 2) / 2,
  y: 0,
  height: 10,
  width: 2,
  color: "#00adb5"
}
let hand = {
  x: 0,
  y: 0
};

function setup() {
  createCanvas(640, 450);
  video = createCapture(VIDEO);
  video.hide();
  poseNet = ml5.poseNet(video, modelReady);
  poseNet.on('pose', gotPose);
}


function gotPose(result) {
  if (result[0]) {
    hand.x = result[0].pose.rightWrist.x;
    hand.y = result[0].pose.rightWrist.y;
    if (hand.y + 50 < height && hand.y - 50 > 0) {
      user.y = (result[0].pose.rightWrist.y) - 50;
    }
  }
}

function modelReady() {
  console.log("Posenet Ready!");
  play = true;
}

function draw() {
  background("#0f4c75");
  //  image(video,0,0);
  if (play) {
    if (ball.x - ball.radius < 0) {
      ai.score++;
      resetBall();
    } else if (ball.x + ball.radius > width) {
      user.score++;
      resetBall();
    }

    ball.x += ball.xVelocity;
    ball.y += ball.yVelocity;

    ai.y += ((ball.y - (ai.y + ai.height / 2))) * 0.1;

    if (ball.y + ball.radius > height || ball.y - ball.radius < 0) {
      ball.yVelocity = -ball.yVelocity;
    }

    let player = (ball.x + ball.radius < width / 2) ? user : ai;

    if (collision(ball, player)) {
      let collidpoint = (ball.y - (player.y + player.height / 2));

      collidpoint = (collidpoint / (player.height / 2));

      let angelRad = (Math.PI / 4) * collidpoint;

      let direction = (ball.x + ball.radius < width / 2) ? 1 : -1;

      ball.xVelocity = direction * ball.speed * Math.cos(angelRad);
      ball.yVelocity = ball.speed * Math.sin(angelRad);

      ball.speed += 0.1;
    }

    fill("white");
    stroke(255);
    line(width / 2, 0, width / 2, height);

    fill("#931a25")
    rect(user.x, user.y, user.width, user.height);
    rect(ai.x, ai.y, ai.width, ai.height);

    fill("white");
    textSize(32);
    text(user.score, width / 4, height / 4);
    text(ai.score, 3 * width / 4, height / 4);

    fill("white");
    ellipse(ball.x, ball.y, ball.radius);

    /*fill("red");
    ellipse(hand.x, hand.y, 20);*/
  }
}

function collision(b, p) {
  b.top = b.y - b.radius;
  b.right = b.x + b.radius;
  b.bottom = b.y + b.radius;
  b.left = b.x - b.radius;

  p.top = p.y;
  p.right = p.x + p.width;
  p.bottom = p.y + p.height;
  p.left = p.x;

  return p.left < b.right && p.top < b.bottom && p.right > b.left && p.bottom > b.top;
}

function resetBall() {
  ball.x = width / 2;
  ball.y = height / 2;
  ball.xVelocity = -ball.xVelocity;
  ball.speed = 7;
}
