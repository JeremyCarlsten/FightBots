var mrvn_targetAquired = 0;
var mrvn_targetY = 0;
var mrvn_targetX = 0;
var mrvn_previousAngle = 0;
var mrvn_cloneId = 0;
var mrvn_timeToChangeDirection = 0;
var mrvn_cloneInit = true;

var isClone = function (robot) {
    return !!robot.parentId;
};

var isRelated = function (robot, scannedRobot) {
    return robot.id == scannedRobot.parentId || robot.parentId == scannedRobot.id;
};


var calculateAngleToTarget = function (robotX, robotY, absoluteAngle) {
    var deltaX = robotX - mrvn_targetX;
    var deltaY = robotY - mrvn_targetY;
    var angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI;

    angle = angle - absoluteAngle;

    if (angle > 180) angle -= 360;
    if (angle < -180) angle += 360;

    return angle;
};

var smartRotateCannon = function (robot, number) {
    if (robot.position.x <= 25 || robot.position.y <= 25) {
        var relativeAngle = robot.cannonRelativeAngle;
        if (relativeAngle > 270 && relativeAngle < 359.999 ) {
            robot.rotateCannon(-number);
        } else if(relativeAngle < 90 && relativeAngle > 0){
            robot.rotateCannon(number);
        }
    }
};

var Robot = function (robot) {
};


Robot.prototype.onIdle = function (ev) {
    var robot = ev.robot;
    var robotX = robot.position.x;
    var robotY = robot.position.y;

    if (robot.availableClones) {

        robot.clone();
    }

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
        smartRotateCannon(robot, 2)
    }
    if (isClone(robot) && mrvn_cloneInit) {
        mrvn_cloneInit = false;
        robot.back(20);
        robot.turn(90);
    }
    robot.ahead(1);

};

Robot.prototype.onScannedRobot = function (ev) {
    var robot = ev.robot;
    var target = ev.scannedRobot;

    if (isRelated(robot, target)) {
        // smartRotateCannon(robot, 10);
    } else {
        mrvn_targetAquired = 50;

        // mrvn_targetX = target.position.x;
        // mrvn_targetY = target.position.y;
        //robot.fire();
    }
};

Robot.prototype.onWallCollision = function (ev) {
    var robot = ev.robot;

    robot.turn(ev.bearing + 90);
};

Robot.prototype.onRobotCollision = function (ev) {
    var robot = ev.robot;
    robot.back(20);
    robot.turn(30);

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
