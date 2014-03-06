
var mrvn_targetAquired = 0;
var mrvn_targetY = 0;
var mrvn_targetX = 0;
var mrvn_previousAngle = 0;
var mrvn_cloneId = 0;
var mrvn_robotId = 0;

var calculateAngleToTarget = function (robotX, robotY, absoluteAngle) {
    var deltaX = robotX - mrvn_targetX;
    var deltaY = robotY - mrvn_targetY;
    var angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI;

    angle = angle - absoluteAngle;

    if (angle > 180) angle -= 360;
    if (angle < -180) angle += 360;

    return angle;
};

var Robot = function (robot) {};

Robot.prototype.onIdle = function (ev) {
    var robot = ev.robot;
  //if(robot.availableClones){
   //	robot.clone(); 
   // mrvn_robotId = robot.id();
    // need to get clone id
  //}
    var robotX = robot.position.x;
    var robotY = robot.position.y;
    if (mrvn_targetX != 0 && mrvn_targetY != 0) {
        var angle = calculateAngleToTarget(robotX, robotY, robot.cannonAbsoluteAngle);

        angle = angle + mrvn_previousAngle;
        robot.rotateCannon(angle);

        if (mrvn_targetAquired > 0) {
            mrvn_targetAquired--;
        } else {
            mrvn_targetX = 0;
            mrvn_targetY = 0;
        }
    } else {
        robot.rotateCannon(2);
    }
    robot.ahead(1);
};

Robot.prototype.onScannedRobot = function (ev) {
    var robot = ev.robot;
    var target = ev.scannedRobot;
  
  //if(target.id != mrvn_robotId){ 

    mrvn_targetAquired = 50;

    mrvn_targetX = target.position.x;
    mrvn_targetY = target.position.y;  
    robot.fire();
  //}
};

Robot.prototype.onWallCollision = function (ev) {
    var robot = ev.robot;

    robot.turn(ev.bearing + 90);
};

Robot.prototype.onRobotCollision = function (ev) { 
    var robot = ev.robot;
    robot.back(20); 
};

Robot.prototype.onHitByBullet = function (ev) {     
    var robot = ev.robot;      
    //robot.rotateCannon(ev.bearing);
    if (robot.availableDisappears > 0) {
        robot.disappear();
    } else {
        robot.ahead(10);
    }
};
