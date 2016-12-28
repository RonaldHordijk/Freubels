int fcount, lastm;
float frate;
int fint = 3;

void setup() {
  //fullScreen(P3D);
  size(600,400,P3D);
  frameRate(60);
  noStroke();
}

void drawFps() {
  fcount += 1;
  int m = millis();
  if (m - lastm > 1000 * fint) {
    frate = float(fcount) / fint;
    fcount = 0;
    lastm = m;
    println("fps: " + frate);
  }
  fill(0, 255, 0);
  text("fps: " + frate, 10, 20);
}

void draw() {
  background(0x333377);
  lights();
  
  pushMatrix(); 
  
  translate(width/2, height/2, -100);
  rotateX(-0.5);
  rotateY(frameCount * PI/200);
  
  int boxSize = width / 3;

  fill(255,255,0);
  box(boxSize);
 
  popMatrix();
  drawFps();
}