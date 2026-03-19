import mongoose from 'mongoose';

const BlogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a title for this blog post.'],
        maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    description: {
        type: String,
        required: [true, 'Please provide a short description.'],
        maxlength: [300, 'Description cannot be more than 300 characters'],
    },
    content: {
        type: String,
        required: [true, 'Please provide content for this blog post.'],
    },
    image: {
        type: String,
        required: false,
    },
    author: {
        type: String,
        required: true,
        default: 'Admin',
    },
    isPublished: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});

export default mongoose.models.Blog || mongoose.model('Blog', BlogSchema);
