require('../models/database');
const Category = require('../models/Category');
const Recipe = require('../models/Recipe');

// get homepage
exports.homepage = async(req, res) => {

    try {
        const limitNUmber = 5;
        const categories = await Category.find({}).limit(limitNUmber);

        const latest = await Recipe.find({}).sort({_id: -1}).limit(limitNUmber);
        const thai = await Recipe.find({'category': 'Thai'}).limit(limitNUmber);
        const american = await Recipe.find({'category': 'American'}).limit(limitNUmber);
        const chinese = await Recipe.find({'category': 'Chinese'}).limit(limitNUmber);
        
        const food = {latest, thai, american, chinese};

        res.render('index', { title: 'homepage', categories, food });
    } catch (error) {
        res.status(500).send({message: error.message || "Error occured"});
    }
    
}

// get categories (exploreCategories)
exports.exploreCategories = async(req, res) => {

    try {
        const limitNUmber = 20;
        const categories = await Category.find({}).limit(limitNUmber);
        res.render('categories', { title: 'categories', categories });
    } catch (error) {
        res.status(500).send({message: error.message || "Error occured"});
    }
}

// get recipe/:id (exploreRecipe)
exports.exploreRecipe = async(req, res) => {
  try {
    let recipeId = req.params.id;
    const recipe = await Recipe.findById(recipeId);
    res.render('recipe', { title: 'recipe', recipe});
  } catch (error) {
      res.status(500).send({message: error.message || "Error occured"});
  }
}

// get categoriesById (exploreCategoriesById)
exports.exploreCategoriesById = async(req, res) => {

    try {
        let categoryId = req.params.id;
        const limitNUmber = 20;
        const categoryById = await Recipe.find({'category' : categoryId}).limit(limitNUmber);
        res.render('categories', { title: 'categories', categoryById });
    } catch (error) {
        res.status(500).send({message: error.message || "Error occured"});
    }
}


// POST/search
exports.searchRecipe = async(req, res) => {
    try {
        let searchTerm = req.body.searchTerm;
        let recipe = await Recipe.find( { $text: {$search: searchTerm, $diacriticSensitive: true}});
        //res.json(recipe);
        res.render('search', { title: 'search' , recipe});
    } catch (error) {
        res.status(500).send({message: error.message || "Error Ocured"})
    }
}

//get exploreLatest
exports.exploreLatest = async(req, res) => {
    try {
        const limitNUmber = 20;
        const recipe = await Recipe.find({}).sort({_id: -1}).limit(limitNUmber);
     
        res.render('explore-latest', { title: 'explore-latest', recipe});
    } catch (error) {
        res.status(500).send({message: error.message || "Error occured"});
    }
}

//get exploreRandom
exports.exploreRandom = async(req, res) => {
    try {
        let count = await Recipe.find().countDocuments();
        let random = Math.floor(Math.random()*count);
        let recipe = await Recipe.findOne().skip(random).exec();
        res.render('explore-random', { title: 'explore-random', recipe});
    } catch (error) {
        res.status(500).send({message: error.message || "Error occured"});
    }
}


//get submitRecipe
exports.submitRecipe = async(req, res) => {
    const infoErrorsobj = req.flash('infoErrors');
    const infoSubmitObj = req.flash('infoSubmit');
    res.render('submit-recipe', {title: 'Submit Recipe', infoErrorsobj, infoSubmitObj});

}


//post submitRecipeOnPost
exports.submitRecipeOnPost = async(req, res) => {
    try {

        let imageUploadFile;
        let uploadPath;
        let newImageName;

        if(!req.files || Object.keys(req.files).length===0){
            console.log('No files was uploaded');
        }else{
            imageUploadFile = req.files.image;
            newImageName = Date.now() + imageUploadFile.name;
            uploadPath = require('path').resolve('./') + '/public/uploads/' + newImageName;

            imageUploadFile.mv(uploadPath, function(err){
                if(err) return res.status(500).send(err);
            })
        }

        const newRecipe = new Recipe({
            name: req.body.name,
            description: req.body.description,
            ingredients: req.body.ingredients,
            email: req.body.email,
            category: req.body.category,
            image: newImageName
        })
        await newRecipe.save();

        req.flash('infoSubmit', 'Recipe has been added.');
        res.redirect('/submit-recipe');
    } catch (error) {
        //res.json(error);
        req.flash('infoErrors', error);
        res.redirect('/submit-recipe');
    }
}






//update Recipe
// async function updateRecipe(){
//     try {
//         const res = await Recipe.updateOne({name: 'Stir-fried vegetables'}, {name: 'Stir Fried Vegetables'});
//         res.n;// number of documents matched
//         res.nModified; //number of modifed
//     } catch (error) {
//         console.log(error);
//     }
// }
//updateRecipe();


//delete Recipe
// async function deleteRecipe(){
//     try {
//         await Recipe.deleteOne({name: 'Tea'});
       
//     } catch (error) {
//         console.log(error);
//     }
// }
// deleteRecipe();



// async function insertDymmyRecipeData(){
//       try {
//         await Recipe.insertMany([
//           { 
//             "name": "Stir-fried vegetables",
//             "description": `Crush the garlic and finely slice the chilli and spring onion. Peel and finely slice the red onion, and mix with the garlic, chilli and spring onion.
//             Shred the mangetout, slice the mushrooms and water chestnuts, and mix with the shredded cabbage in a separate bowl to the onion mixture.
//             Heat your wok until it’s really hot. Add a splash of oil – it should start to smoke – then the chilli and onion mix. Stir for just 2 seconds before adding the other mix. Flip and toss the vegetables in the wok if you can; if you can’t, don’t worry, just keep the vegetables moving with a wooden spoon, turning them over every few seconds so they all keep feeling the heat of the bottom of the wok. Season with sea salt and black pepper.
//             After a minute or two, the vegetables should have begun to soften. Add the soy sauce and 1 teaspoon of sesame oil and stir in. After about 30 seconds the vegetables should smell amazing! Tip on to a serving dish, sprinkle over some sesame seeds and tuck in.`,
//             "email": "abhishekbauri12@gmail.com",
//             "ingredients": [
//               "1 clove of garlic",
//               "1 fresh red chilli",
//               "3 spring onions",
//               "1 small red onion",
//               "a few shiitake mushrooms",
//               "a few water chestnuts",
//               "1 handful of shredded green cabbage",
//               "olive oil",
//               "2 teaspoons soy sauce",
//               "sesame seeds to sprinkle on top"
//             ],
//             "category": "Chinese", 
//             "image": "stir-fried-vegetables.jpg"
//           },

//           { 
//             "name": "Versatile veggie chilli",
//             "description": `Peel and chop the sweet potatoes into bite-sized chunks, then place onto a baking tray.
//             Sprinkle with a pinch each of cayenne, cumin, cinnamon, sea salt and black pepper, drizzle with oil then toss to coat. Roast for 45 minutes to 1 hour, or until golden and tender.
//             Peel and roughly chop the onion. Halve, deseed and roughly chop the peppers, then peel and finely slice the garlic.
//             Pick the coriander leaves, finely chopping the stalks. Deseed and finely chop the chillies.
//             Meanwhile, put 2 tablespoons of oil in a large pan over a medium-high heat, then add the onion, peppers and garlic, and cook for 5 minutes, stirring regularly.
//             Add the coriander stalks, chillies and spices, and cook for a further 5 to 10 minutes, or until softened and starting to caramelise, stirring occasionally.
//             Add the beans, juice and all. Tip in the tomatoes, breaking them up with the back of a spoon, then stir well.
//             Bring to the boil, then reduce the heat to medium-low and leave to tick away for 25 to 30 minutes, or until thickened and reduced – keep an eye on it, and add a splash of water to loosen, if needed.
//             Stir the roasted sweet potato through the chilli with most of the coriander leaves, then taste and adjust the seasoning, if needed.
//             Finish with a squeeze of lime or lemon juice or a swig of vinegar, to taste, then scatter over the remaining coriander. Delicious served with yoghurt or soured cream, guacamole and rice, or tortilla chips.`,
//             "email": "abhishekbauri12@gmail.com",
//             "ingredients": [
//               "500 g sweet potatoes",
//               "1 level teaspoon cayenne pepper, plus extra for sprinkling",
//               "1 heaped teaspoon ground cumin , plus extra for sprinkling",
//               "1 level teaspoon ground cinnamon , plus extra for sprinkling",
//               "olive oil",
//               "1 onion",
//               "2 mixed-colour peppers",
//               "2 cloves of garlic",
//               "1 bunch of fresh coriander (30g)",
//               "2 fresh mixed-colour chillies",
//               "2 x 400 g tins of beans, such as kidney, chickpea, pinto, cannellini",
//               "2 x 400 g tins of quality plum tomatoes",
             
//             ],
//             "category": "Mexican", 
//             "image": "versatile-veggie-chilli.jpg"
//           },

//           { 
//             "name": "Smoky veg patties",
//             "description": `Trim the tough end off 1 head of broccoli (375g). Finely chop the remaining stalk, then break the florets apart. Trim and finely slice ½ a bunch of spring onions.
//             Peel and chop 600g of potatoes into 3cm chunks, then cook in a pan of boiling salted water for 12 minutes, or until tender, adding the broccoli florets for the last 3 minutes.
//             Meanwhile, drizzle 1 tablespoon of olive oil into a large frying pan on medium heat, add the sliced spring onions and broccoli stalks and cook for 10 minutes, or until softened, then remove from the heat.
//             Once cooked, drain the potatoes and broccoli and allow to steam dry, tip into the frying pan and leave to cool while you make the salsa.
//             Deseed 1 red pepper and trim the remaining ½ a bunch of spring onions, then finely chop and place in a bowl with 1 tablespoon of red wine vinegar and a pinch of sea salt and black pepper.
//             Drain and add 1 x 400g tin of cannellini beans to the frying pan, grate in 60g of Cheddar cheese, season with salt and pepper, then sprinkle in ½ a teaspoon of smoked paprika. Mash and mix together well, then divide into 8 equal-sized balls and pat into flat rounds.
//             Place the frying pan back on a medium-high heat, drizzle in 1 tablespoon of olive oil, then add the patties and cook for 2 to 3 minutes on each side, or until golden and crisp, then remove (and keep warm) while you fry 4 eggs to your liking.
//             To serve, place two patties and a fried egg on each plate, then top each with a spoonful of salsa. Serve 1 x 80g bag of watercress, spinach & rocket on the side and toss with a little extra virgin olive oil and red wine vinegar, if you like.`,
//             "email": "abhishekbauri12@gmail.com",
//             "ingredients": [
//               "1 head of broccoli",
//               "1 bunch of spring onions",
//               "600 g Maris Piper potatoes",
//               "1 red pepper",
//               "1 x 400 g tin of cannellini beans",
//               "60 g Cheddar cheese",
//               "½ teaspoon smoked paprika",
//               "4 large free-range eggs",
//               "1 x 80 g bag of watercress, spinach & rocket",
              
//             ],
//             "category": "Thai", 
//             "image": "smoky-veg-patties.jpg"
//           },

//           { 
//             "name": "Angry bean salad",
//             "description": `Carefully plunge the tomatoes into a pan of fast-boiling salted water for exactly 30 seconds, scoop out with a sieve and run under cold water.
//             Line up the beans, remove just the stalk ends and place in the boiling water for 4 minutes.
//             Meanwhile, pick the mint leaves, putting the baby leaves aside for garnish. Peel the garlic, then finely slice with the chillies.
//             Pinch and peel away the tomato skins, reserving the flesh (it’s a bit of a faff, but it’s worth it).
//             Drain the beans, placing the pan back on a medium heat.
//             Drizzle in 1 tablespoon of oil, then add the garlic, chilli and mint leaves. Fry for 2 minutes, add the tomatoes, vinegar and beans and simmer for 4 minutes, stirring regularly to break up the tomatoes.
//             Taste and season to absolute perfection with sea salt and black pepper, then spoon on to a platter along with any tasty juices.
//             Scatter over the mozzarella and reserved mint leaves, and serve with hot toast.`,
//             "email": "abhishekbauri12@gmail.com",
//             "ingredients": [
//               "400 g ripe mixed-colour cherry tomatoes",
//               "400 g green and yellow beans",
//               "4 sprigs of fresh mint",
//               "4 cloves of garlic",
//               "2 fresh red chillies",
//               "olive oil",
//               "3 tablespoons red wine vinegar , or balsamic vinegar",
//               "8 bocconcini mozzarella , (150g)",
//               "4 slices of rustic bread",
              
//             ],
//             "category": "American", 
//             "image": "angry-bean-salad.jpg"
//           },

//           { 
//             "name": "Crispy chicken",
//             "description": `Place the chicken breasts between two large sheets of greaseproof paper, and whack with the base of a large non-stick frying pan to flatten them to about 1cm thick.
//             Tear the bread into a food processor, then peel, chop and add the garlic, and blitz into fairly fine crumbs.
//             Pour the crumbs over the chicken, roughly pat on to each side, then re-cover with the paper and whack again, to hammer the crumbs into the chicken and flatten them further.
//             Put the pan on a medium heat. Fry the crumbed chicken in 1 tablespoon of olive oil for 3 minutes on each side, or until crisp, golden and cooked through.
//             Slice, plate up, season to perfection with sea salt and black pepper, sprinkle with lemon-dressed rocket, and serve with lemon wedges, for squeezing over.`,
//             "email": "abhishekbauri12@gmail.com",
//             "ingredients": [
//               "2 x 120 g free-range skinless chicken breasts",
//               "2 thick slices of seeded wholemeal bread , (75g each)",
//               "1 clove of garlic",
//               "1 lemon",
//               "50 g rocket",
             
//             ],
//             "category": "Indian", 
//             "image": "crispy-chicken.jpg"
//           },
//         ]);
//       } catch (error) {
//         console.log('err', + error)
//       }
//  }
    
//     insertDymmyRecipeData();








// async function insertDummyCategoryData() {

//     try{
//         await Category.insertMany([
//          {
//             "name": "Thai",
//             "image": "thai-food.jpg"
//             },
//             {
//             "name": "American",
//             "image": "american-food.jpg"
//             }, 
//             {
//             "name": "Chinese",
//             "image": "chinese-food.jpg"
//             },
//             {
//             "name": "Mexican",
//             "image": "mexican-food.jpg"
//             }, 
//             {
//             "name": "Indian",
//             "image": "indian-food.jpg"
//             },
//             {
//             "name": "Spanish",
//             "image": "spanish-food.jpg"
//         }
//         ]);
//     }catch(error){
//         console.log('err', + error)
//     }
// }
// insertDummyCategoryData();