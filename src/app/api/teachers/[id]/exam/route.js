import {connectToDatabase} from '@/app/lib/mongodb';
import Question from '@/app/models/questionAndAnswer';
import Exam from '@/app/models/academicSchema';

export async function POST(request) {
  try {
    console.log("hit>>>>>>....");
    
    await connectToDatabase();

    const body = await request.json();
    console.log("Received data:", JSON.stringify(body, null, 2));

    const { question, options, correctOption, examId, marks, createdBy } = body;

    // More detailed validation
    if (!question) {
      return Response.json({ message: 'Question text is required' }, { status: 400 });
    }
    
    if (!options || !Array.isArray(options) || options.length === 0) {
      return Response.json({ message: 'Options array is required' }, { status: 400 });
    }
    
    if (!examId) {
      return Response.json({ message: 'Exam ID is required' }, { status: 400 });
    }
    
    if (!createdBy) {
      return Response.json({ message: 'CreatedBy field is required' }, { status: 400 });
    }


    // Format options with correct answer
    const formattedOptions = options.map((option, index) => ({
      text: option,
      isCorrect: index === parseInt(correctOption)
    }));

    console.log("Formated......",formattedOptions);
    

    // Create new question
    const newQuestion = new Question({
      question,
      options: formattedOptions,
      examId,
      marks: marks || 1,
      createdBy : createdBy
    });

    const savedQuestion = await newQuestion.save();
    
    console.log("After Saved To DB : ",savedQuestion);
    
    return Response.json(
      { 
        message: 'Question added successfully', 
        question: savedQuestion 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error adding question:', error);
    return Response.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Handle unsupported methods
export async function GET(request) {
  try {
    await connectToDatabase();
    
    // Fetch questions based on query
    const questions = await Question.find()
    
    return Response.json(
      { 
        message: 'Questions retrieved successfully', 
        questions,
        count: questions.length
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error retrieving questions:', error);
    return Response.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT() {
  return Response.json(
    { message: 'Method not allowed' },
    { status: 405 }
  );
}

export async function DELETE(request) {
  try {
    await connectToDatabase();
    
    if (!id) {
      return Response.json(
        { message: 'Question ID is required' },
        { status: 400 }
      );
    }
    
    // Find and delete the question
    const deletedQuestion = await Question.findByIdAndDelete(id);
    
    if (!deletedQuestion) {
      return Response.json(
        { message: 'Question not found' },
        { status: 404 }
      );
    }
    
    return Response.json(
      { 
        message: 'Question deleted successfully', 
        question: deletedQuestion 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting question:', error);
    return Response.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}