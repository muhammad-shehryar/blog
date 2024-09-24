const express = require("express")
const router = express.Router();
const Post = require("../models/Post")
const authMiddleware = require('../middleware/auth'); // This middleware will ensure only logged-in users can create/update/delete posts

//route post/api/posts
// create a new blog post api

router.post("/",authMiddleware,async()=>{
    const {title,content}=req.body;

    try{
        const newPost = new Post({
            title,
            content,
            author:req.user.id,//getting the logged in user from the token
        })

        const post = await newPost.save()
        res.json(post)
    }catch(error){
        console.error(error)
        res.status(500).send(`server error`)
    }
})

// @route   GET /api/posts
// @desc    Get all blog posts

router.get("/",async(req,res)=>{
    try{
        const posts = await Post.find().populate('author',['name','email'])
        res.json(posts)
    } catch(err){
        console.error(err.message)
        res.status(500).send(`server error`)
    }
})

// @route   GET /api/posts/:id
// @desc    Get a single post by ID

router.get("/:id",async(req,res)=>{
    try{
        const post = await Post.findById(req.params.id).populate('author',['name','email'])

        if(!post){
            return res.status(404).json({msg:"post not found"})
        }
        res.json(post)
    }catch(err){
        console.error(err.message)
        res.status(500).send('server error')
    }
})

// @route   PUT /api/posts/:id
// @desc    Update a post by ID

router.put("/:id",authMiddleware,async(req,res)=>{
    const {title,content}=req.body;
    
    try{
        let post = await Post.findById(req.params.id)

        if(!post){
            return res.status(404).json({msg:"Post not found"})
        }
        // Check if the logged-in user is the author of the post
        if(post.author.toString() !==req.user.id){
            return res.status(401).json({msg:`user not authorized`})
        }
        post = await Post.findByIdAndUpdate(
            req.params.id,{title,content},{new:true}
        )   
        req.json(post)
    }catch(error){
        console.error(error.message)
        res.status(500).send('server error')
    }
})

// @route   DELETE /api/posts/:id
// @desc    Delete a post by ID

router.delete("/:id",authMiddleware,async()=>{
    try{
        const post = await Post.findById(req.params.id)

        if(!post){
            return res.status(404).json({msg:"post not found"})
        }
        // // Check if the logged-in user is the author of the post
        if(post.author.toString() !== req.user.id){
            return res.status(401).json({msg:"User not authorized"})
        }
        await post.remove()
        res.json({msg:"post removed"})
    } catch(error){
        res.status(500).send("Server error")
    }
})

module.exports = router;