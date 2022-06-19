class Middleware {
    static isAuth = (req,res,next)=>{
   
        if (req.session.email) {
            next()
        } else {
           return res.redirect('/login');
        }
    }
}


export default Middleware