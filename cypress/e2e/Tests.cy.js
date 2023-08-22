/// <reference types="Cypress"/>

it("Filter results", ()=>{

    cy.visit("https://reverb.com/");

    cy.get(".search-input-group__input").type("Guitars");
    cy.get(".search-input-group__button").click();

    cy.get(".search-overview__count h1 span span").should("contain.text", "Guitars");

    cy.get(".search-overview__secondary > div > div:nth-child(2) button").click();
    cy.get("#floating-ui-14").should("be.visible");
    cy.get(".rc-popover .facet--collapsed .facet__options div:first-child a").click();

    cy.get(".search-overview__secondary > div > div:nth-child(3) button").click();
    cy.get(".rc-popover [id='make-gibson']").check();

    cy.get(".search-overview__secondary > div > div:nth-child(4) button").click();
    cy.get(".rc-popover #minValue").type("200");
    cy.get(".rc-popover #maxValue").type("1000");
    cy.get(".rc-popover [type='submit']").click();

    cy.get(".search-overview__count h1 span").should("contain.text", "48");

})

it("Try to comment on a product without being logged in", ()=>{

    cy.visit("https://reverb.com");

    cy.get("ul [data-header-category='pedalsAmps']").click();
    cy.get(".category-flyout__subhead [href='/c/amps/']").should("be.visible");

    cy.contains("Small Amps").click();
    cy.get(".dynamic-page__two-col__main > div:first-child h2").should("have.text", "Popular Small Amps");

    cy.get("[id='13'] .tiles--large > li:first-child").click();

    cy.contains("Write a Product Review").click();

    cy.get(".rc-alert-box--small div").should("be.visible");
    cy.get(".rc-alert-box--small div").should("have.text", "Please log in or create a free account to write a product review");

})

it("Add items to cart and proceed to checkout", ()=>{

    cy.visit("https://reverb.com/item/51898487-jackson-performer-ps7-80-s-80s-red?bk="); //Clicking on products generate a new tab, so direct access was needed
    cy.get(".item2-title__inner h1").should("have.text", "Jackson  Performer PS7 80’s 80s Red");
    
    cy.contains("Add to Cart").click();
    cy.url().should("eq", "https://reverb.com/cart")
    
    cy.contains("Keep Shopping").click();
    cy.url().should("eq", "https://reverb.com/");
    
    cy.visit("https://reverb.com/item/38420785-squier-telecaster-affinity-new-generation-2020-silver?bk=");
    cy.get(".item2-title__inner h1").should("have.text", "Squier Telecaster Affinity New Generation 2020 Silver");
    
    cy.contains("Add to Cart").click();
    cy.url().should("eq", "https://reverb.com/cart");
    
    cy.contains("Keep Shopping").click();
    cy.url().should("eq", "https://reverb.com/");

    cy.request("GET", "https://reverb.com/cart").then((response) => {
     expect(response.status).to.eq(200);
     expect(response.body).to.contain("Squier Telecaster Affinity New Generation 2020 Silver");
     expect(response.body).to.contain("Jackson  Performer PS7 80’s 80s Red");
   });

   cy.request("GET", "https://reverb.com/multi-checkout/RS-1605626/paypal").then((response) => {
     expect(response.status).to.eq(200);
     expect(response.body).to.contain("Check out");
   });

})