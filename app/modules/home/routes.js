/**
 * We load the ExpressJS module.
 * More than just a mere framework, it is also a complementary library
 * to itself.
 */
var express = require('express');

/**
 * Having that in mind, this is one of its robust feature, the Router.
 * You'll appreciate this when we hit RESTful API programming.
 * 
 * For more info, read this: https://expressjs.com/en/4x/api.html#router
 */
var router = express.Router();

/**
 * Import the authentication middleware to check for the user object
 * in the session.
 */
var authMiddleware = require('../auth/middlewares/auth');

/**
 * Use the middleware to check all routes registered for this router.
 */
router.use(authMiddleware.hasAuth);

/**
 * If you can notice, there's nothing new here except we're declaring the
 * route using the router, and not using app.use().
 * 
 * We're also importing controllers from the controller directory of this module.
 */
var indexController = require('./controllers/index');
router.get('/', indexController);

router.post('/inventory', (req, res) => {
    var db = require('../../lib/database')();{
      db.query("INSERT INTO tblinventory ( strProdName, strUnit, intBarQty, intStorageQty, fltRetailPrc, intStat) VALUES ( ?, ?, ?, ?, ?, 1) ",[req.body.productname, req.body.uom, req.body.barqty, req.body.strqty, req.body.prc], (err, results, fields)=>{
        if (err)
          console.log(err);
        else{
          res.redirect('/inventory');
        }
        });
      }
  });
router.post('/inventory/edit', (req, res) => {
    var db = require('../../lib/database')();{
      db.query("UPDATE tblinventory  SET strProdName = ?, strUnit = ?, intBarQty = ?, intStorageQty = ?, fltRetailPrc = ? WHERE intProdId = ? ",[req.body.productname, req.body.uom, req.body.barqty, req.body.strqty, req.body.prc, req.body.id], (err, results, fields)=>{
        if (err)
          console.log(err);
        else{
          res.redirect('/inventory');
        }
        });
      }
  });
  router.post('/inventory/delete', (req, res) => {
    var db = require('../../lib/database')();{
      db.query("UPDATE tblinventory  SET intStat = 0 WHERE intProdId = ?",[req.body.id], (err, results, fields)=>{
        if (err)
          console.log(err);
        else{
          res.redirect('/inventory');
        }
        });
      }
  });
  router.post('/inventory/revert', (req, res) => {
    var db = require('../../lib/database')();{
      db.query("UPDATE tblinventory  SET intStat = 1 WHERE intProdId = ?",[req.body.id], (err, results, fields)=>{
        if (err)
          console.log(err);
        else{
          res.redirect('/inventory');
        }
        });
      }
  });
  router.post('/admin/staffs', (req, res) => {
    var db = require('../../lib/database')();{
        db.query("INSERT INTO tblstaff ( strLname, strFname, strUsername, strPassword, strStatus , intStatus ,strType  ) VALUES ( ?, ?, ?, ? ,  'Available', 0 , 'user' ) ",[req.body.lname, req.body.fname ,req.body.user, req.body.pass], (err, results, fields)=>{
          if (err)
            console.log(err);
          else{
            res.redirect('/admin/staffs');
          }
          });
        }
    });
    router.post('/admin/staffs/edit', (req, res) => {
        var db = require('../../lib/database')();{
          db.query("UPDATE tblstaff  SET strLname = ?, strFname = ?, strStatus = ?  WHERE intStaffId = ? ",[req.body.lname, req.body.fname, req.body.status, req.body.staffid], (err, results, fields)=>{
            if (err)
              console.log(err);
            else{
              res.redirect('/admin/staffs');
            }
            });
          }
      });
      router.post('/admin/staffs/delete', (req, res) => {
        var db = require('../../lib/database')();{
          db.query("UPDATE tblstaff SET intStatus = 0, strStatus = 'Unavailable' WHERE intStaffId = ?",[req.body.id], (err, results, fields)=>{
            if (err)
              console.log(err);
            else{
              res.redirect('/admin/staffs');
            }
            });
          }
      });
      router.post('/admin/staffs/revert', (req, res) => {
        var db = require('../../lib/database')();{
          db.query("UPDATE tblstaff  SET intStatus = 1 , strStatus = 'Available' WHERE intStaffId = ?",[req.body.id], (err, results, fields)=>{
            if (err)
              console.log(err);
            else{
              res.redirect('/admin/staffs');
            }
            });
          }
      });
function viewInventory(req, res, next){
  var db = require('../../lib/database')();
  db.query("SELECT * FROM tblinventory ", function (err, results, fields) {
      if (err) return res.send(err);
      console.log(results)
      req.inventory = results;
      return next();
  });
}
function viewStaffs(req, res, next){
    var db = require('../../lib/database')();
    db.query("SELECT * FROM tblstaff ", function (err, results, fields) {
        if (err) return res.send(err);
        console.log(results)
        req.staffs = results;
        return next();
    });
  }
function viewReports(req, res, next){
    var db = require('../../lib/database')();
    db.query("SELECT * FROM tblinventory WHERE intStat = 1  ", function (err, results, fields) {
        if (err) return res.send(err);
        console.log(results)
        req.deleted = results;
        return next();
    });
  }
function viewAvailable(req, res, next){
    var db = require('../../lib/database')();
    db.query("SELECT * FROM tblstaff WHERE strStatus = 'Available'", function (err, results, fields) {
        if (err) return res.send(err);
        console.log(results)
        req.available = results;
        return next();
    });
  }



function logout(req,res){
    res.render('auth/views/login')
}
function inventory(req,res){
    res.render('home/views/inventory', {inventorytab: req.inventory})
}
function server(req,res){
    res.render('home/views/server')
}
function orders(req,res){
    res.render('home/views/orders')
}
function deliveries(req,res){
    res.render('home/views/deliveries')
}
function staff(req,res){
    res.render('admin/users/views/staffs', {staffstab: req.staffs});
}
function dash(req,res){
    res.render('admin/users/views/index')
}
function reports(req,res){
    res.render('admin/users/views/reports', {reports: req.deleted, available: req.available})
}
router.get('/', logout);
router.get('/inventory', viewInventory, inventory );
router.get('/inventory/edit' , viewInventory, inventory);
router.get('/inventory/delete' , viewInventory, inventory);
router.get('/inventory/revert' , viewInventory, inventory);
router.get('/server', server );
router.get('/orders', orders);
router.get('/deliveries' , deliveries);
router.get('/admin/staffs' , viewStaffs, staff);
router.get('/admin/reports' ,viewReports, viewAvailable, reports);
router.get('/admin/staffs/edit' , viewStaffs, staff);
router.get('/admin/staffs/delete' , viewStaffs, staff);
router.get('/admin/staffs/revert' , viewStaffs, staff);
router.get("/admin", dash);
/**
 * Here we just export said router on the 'index' property of this module.
 */
exports.index = router;