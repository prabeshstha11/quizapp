use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Question {
    pub id: String,
    pub question: String,
    pub options: Vec<String>,
    pub correct_answer: usize, // Index of correct option (0-based)
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ParseResult {
    pub questions: Vec<Question>,
    pub error: Option<String>,
}

#[tauri::command]
pub fn parse_quiz_file(content: String) -> ParseResult {
    let mut questions = Vec::new();
    
    for (line_num, line) in content.lines().enumerate() {
        let trimmed = line.trim();
        
        // Skip empty lines
        if trimmed.is_empty() {
            continue;
        }
        
        // Split by pipe delimiter
        let parts: Vec<&str> = trimmed.split('|').map(|s| s.trim()).collect();
        
        // Expected format: Question | Option A | Option B | Option C | Option D | Correct (0-3)
        if parts.len() < 6 {
            continue; // Skip malformed lines
        }
        
        let question_text = parts[0].to_string();
        let mut options = Vec::new();
        
        // Collect options (part 1 through n-1, excluding last which is the answer)
        for i in 1..parts.len()-1 {
            options.push(parts[i].to_string());
        }
        
        // Parse correct answer index
        let correct_answer = match parts[parts.len()-1].parse::<usize>() {
            Ok(idx) if idx < options.len() => idx,
            _ => {
                eprintln!("Invalid answer index on line {}: '{}'", line_num + 1, parts[parts.len()-1]);
                continue; // Skip this question
            }
        };
        
        questions.push(Question {
            id: uuid::Uuid::new_v4().to_string(),
            question: question_text,
            options,
            correct_answer,
        });
    }
    
    if questions.is_empty() {
        ParseResult {
            questions: Vec::new(),
            error: Some("No valid questions found. Format: Question? | Option A | Option B | Option C | Option D | 0-3".to_string()),
        }
    } else {
        ParseResult {
            questions,
            error: None,
        }
    }
}
