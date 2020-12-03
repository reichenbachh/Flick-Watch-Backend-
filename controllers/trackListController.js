const flickList = require("../models/flickList");

//@register GET
//@route    GETflickApi/v1/flickList/getMyFlickList/:user
//@acess    Private
exports.getFlickList = async (req, res, next) => {
  try {
    const userflickList = await flickList.findOne({ user: req.params.user });
    if (!userflickList) {
      res.status(200).json({
        message: "no tracked movies",
      });
    }
    if (userflickList) {
      res.status(200).json({
        userflickList,
      });
    }
  } catch (error) {
    next(error);
  }
};

//@register POST
//@route    POST flickApi/v1/flickList/newFlickTrack
//@acess    Private
exports.trackFlick = async (req, res, next) => {
  try {
    let { user, payloadName, payloadData, tmdb_id } = req.body;
    //check if user already has a list of tracked flicks
    const listExists = await flickList.findOne({ user });

    // if  user has no list create one and push data unto array
    if (!listExists && payloadName === "show") {
      let newList = await flickList.create({ user, showList: payloadData });
    } else if (!listExists && payloadName === "movie") {
      let newList = await flickList.create({ user, movieList: payloadData });
    }

    if (listExists && payloadName === "show") {
      for (let i = 0; i < listExists.showList.length; i++) {
        if (listExists.showList[i].tmdb_id === payloadData.tmdb_id.toString()) {
          return res.status(401).json({
            sucess: false,
            error: "you are already tracking this show",
          });
        }
      }
      listExists.showList.push(payloadData);
      listExists.save({ validateBeforeSave: false });
    } else if (listExists && payloadName === "movie") {
      //loop through users movie list and check if it already exists
      for (let i = 0; i < listExists.movieList.length; i++) {
        if (
          listExists.movieList[i].tmdb_id === payloadData.tmdb_id.toString()
        ) {
          return res.status(401).json({
            sucess: false,
            error: "you are already tracking this movie",
          });
        }
      }
      listExists.movieList.push(payloadData);
      listExists.save({ validateBeforeSave: false });
    }

    res.status(200).json({
      success: true,
      message: "flick created and added",
    });
  } catch (error) {
    next(error);
  }
};

//@register DELETE
//@route    DELETE flickApi/v1/flickList/id
//@acess    Private
exports.deleteFromFlickList = async (req, res, next) => {
  try {
    const { flick_id, type, user } = req.params;
    const userFlickList = await flickList.findOne({ user });
    if (type === "movie") {
      await userFlickList.movieList.id(flick_id).remove();
      userFlickList.save({ validateBeforeSave: false });
    }
    if (type === "show") {
      await userFlickList.showList.id(flick_id).remove();
      userFlickList.save({ validateBeforeSave: false });
    }

    res.status(200).json({
      success: true,
      message: "deleted",
    });
  } catch (error) {
    next(error);
  }
};

//@register DELETE
//@route    DELETE //flickApi/v1/flickList
//@acess    Private
exports.resetFlickList = async (req, res, next) => {
  try {
    console.log(req.params.id);

    let { id } = req.params;
    await flickList.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: "your flick list has been deleted",
    });
  } catch (error) {
    next(error);
  }
};
