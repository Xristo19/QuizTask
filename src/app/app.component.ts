import { HttpClient } from '@angular/common/http';
import { Component,ElementRef } from '@angular/core';




@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'SweeftDigitalTask';

      CattegoryURL= "https://opentdb.com/api_category.php";
      categorymap = new Map();
      questionMap = new Map();
      container : string[];
      answers : string[];
      category : number;
      difficulty:string;
      clickedAnswer:string;
      alert:boolean=false;
      point = 0;

      constructor(private http: HttpClient){
          this.container = [];
          this.answers = [];
          this.http.get(this.CattegoryURL).toPromise().then(data =>{
              this.useCategoryData(data);
          });
      }  
        useCategoryData(data){
        let dropdown = document.querySelector("#name");
        let category = data.trivia_categories;
        category.forEach(element => {
          this.container.push(element.name);
          this.categorymap[element.name]=element.id;
        });
      }

        

      URLbuild(category : number,difficulty:string){
      var URL = "https://opentdb.com/api.php?amount=10&category="+this.categorymap[category]+"&difficulty="+difficulty+"&type=multiple";
      return URL;
    }

      useQuestionData(questionData){
        questionData = questionData.results;
      for (let i = 0; i < questionData.length; i++) {
        this.questionMap[i] = questionData[i];
      }
    }
    
    questionList() {
      this.http.get(this.URLbuild(this.category,this.difficulty)).toPromise().then(data =>{
        this.useQuestionData(data);          
        }).then(data => this.Start());
      }
      questionIndex = 0;
      
      Start(){
      document.querySelector("#next").removeAttribute("disabled");
      document.querySelector("#reset").setAttribute("disabled","true");
      if(this.questionIndex === 10){
        window.alert("You Got "+this.point+"Points!");
        this.reset();
        return;
        }
      this.answers = [];
      let currentQuestion = this.questionMap[this.questionIndex];
      document.querySelector("#question").innerHTML = 'Question: '+currentQuestion.question;
      this.answers.push(currentQuestion.correct_answer);
      currentQuestion.incorrect_answers.forEach(element => {
        this.answers.push(element);
      });
      this.answers = this.answers.sort(() => Math.random() - 0.5)
      if(this.questionIndex !== 0){
        let ans = <string> this.questionMap[this.questionIndex-1].correct_answer;
        if(this.clickedAnswer===ans){
          this.point+=10;
          console.log(this.point);
        }
      }     
      this.questionIndex++;
    
    }

  reset(){
    document.querySelector("#question").innerHTML = "";
    this.answers = [];
    this.questionIndex = 0;
    this.questionMap.clear(); 
    document.querySelector("#next").setAttribute("disabled","true");
    document.querySelector("#reset").removeAttribute("disabled");
    this.point = 0;
  } 
}
