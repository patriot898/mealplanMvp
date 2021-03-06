import React from 'react';
import $ from 'jquery';
import TdeeCalculator from './TdeeCalculator.jsx';
import FoodDisplay from './FoodDisplay.jsx';
import RecipeAdder from './RecipeAdder.jsx';
import PlanDisplay from './PlanDisplay.jsx';
import Toolbar from './Toolbar.jsx';
import testData from './testNutrition.js';
import planMaker from './planMaker.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dailyCalories: null,
      recipes: [{ name: 'none', type: 'none' }],
      nutrition: testData.testNutrition,
      itemNutrition: testData.testItemNutrition,
      showAddRecipeModal: false,
      showAddItemModal: false,
      showPlanModal: false,
      showCalculator: true,
      showDatabase: false,
      showAdder: false,
      plan: testData.testPlan
    }
  }

  componentDidMount() {
    this.getRecipes();
  }

  handleShowRecipeModal() {
    this.setState({
      showAddRecipeModal: true
    });
  }

  handleHideRecipeModal() {
    this.setState({
      showAddRecipeModal: false
    });
  }
  handleShowItemModal() {
    this.setState({
      showAddItemModal: true
    });
  }

  handleHideItemModal() {
    this.setState({
      showAddItemModal: false
    });
  }

  handleShowPlanModal() {
    this.setState({
      showPlanModal: true
    })
  }
  handleHidePlanModal() {
    this.setState({
      showPlanModal: false
    })
  }
  handleShowCalculator() {
    this.setState({
      showCalculator: true,
      showAdder: false,
      showDatabase: false
    })
  }
  handleHideCalculator() {
    this.setState({
      showCalculator: false
    })
  }
  handleShowDatabase() {
    this.setState({
      showDatabase: true,
      showAdder: false,
      showCalculator: false
    })
  }
  handleHideDatabase() {
    this.setState({
      showDatabase: false
    })
  }
  handleShowAdder() {
    this.setState({
      showAdder: true,
      showDatabase: false,
      showCalculator: false
    })
  }
  handleHideAdder() {
    this.setState({
      showAdder: false
    })
  }


  evaluateRecipe(recipe) {
    // console.log(recipe);
    $.ajax({
      method: 'post',
      url: '/nutrition',
      data: recipe,
      success: (results) => {
        console.log(results);
        if (recipe.ingr.length > 1) {
          this.setState({ nutrition: results }, () => {
            this.handleShowRecipeModal();
          });
        } else {
          this.setState({ itemNutrition: results }, () => {
            this.handleShowItemModal();
          });
        }
      },
      dataType: 'json',
      error: (err) => {
        alert(err);
      }
    });
  }



  addRecipe(recipe) {
    $.ajax({
      method: 'post',
      url: '/recipes',
      data: recipe,
      success: () => {
        alert("Recipe Added");
        this.setState({
          nutrition: testData.testNutrition,
          itemNutrition: testData.testItemNutrition
        }, () => {
          this.getRecipes()
        })
      },
      error: (err) => {
        alert(JSON.stringify(err));
      }
    });
  }

  getRecipes() {
    $.ajax({
      method: 'get',
      url: '/recipes',
      success: (recipes) => {
        this.setState({
          recipes
        })
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  updateCalories(dailyCalories) {
    const plan = planMaker(this.state.recipes, dailyCalories);
    this.setState({
      plan
    }, () => {
      this.handleShowPlanModal();
    });
  }


  render() {
    return (
      <div>
        <Toolbar
          handleShowAdder={this.handleShowAdder.bind(this)}
          handleHideAdder={this.handleHideAdder.bind(this)}
          handleShowCalculator={this.handleShowCalculator.bind(this)}
          handleHideCalculator={this.handleHideCalculator.bind(this)}
          handleShowDatabase={this.handleShowDatabase.bind(this)}
          handleHideDatabase={this.handleHideDatabase.bind(this)}

         />
        <TdeeCalculator
          updateCalories={this.updateCalories.bind(this)}
          dailyCalories={this.state.dailyCalories}
          show={this.state.showCalculator}
          />
        <PlanDisplay
          plan={this.state.plan}
          handleHide={this.handleHidePlanModal.bind(this)}
          show={this.state.showPlanModal}
          />
        <RecipeAdder
          evaluate={this.evaluateRecipe.bind(this)}
          addRecipe={this.addRecipe.bind(this)}
          nutrition={this.state.nutrition}
          itemNutrition={this.state.itemNutrition}
          recipes={this.state.recipes}
          showAddRecipeModal={this.state.showAddRecipeModal}
          showAddItemModal={this.state.showAddItemModal}
          handleHideRecipeModal={this.handleHideRecipeModal.bind(this)}
          handleShowRecipeModal={this.handleShowRecipeModal.bind(this)}
          handleHideItemModal={this.handleHideItemModal.bind(this)}
          handleShowItemModal={this.handleShowItemModal.bind(this)}
          getRecipes={this.getRecipes.bind(this)}
          show={this.state.showAdder}
        />
        <FoodDisplay
          recipes={this.state.recipes}
          show={this.state.showDatabase}
          />
      </div>
    )
  }
}

export default App;
