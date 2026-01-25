const Trip = require("../models/Trip");

function isAdmin(req, res, next) {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });
  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Admin only" });
  next();
}
async function isTripOwner(req, res, next) {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: "Trip not found" });

    if (trip.createdBy.toString() === req.user.id.toString() || req.user.role === "admin") {
      return next();
    } else {
      return res.status(403).json({ message: "Not the trip owner" });
    }
}

module.exports = {isAdmin, isTripOwner};