require("dotenv").config();

import { createInterface } from "readline";
import { writeFileSync } from "fs";
const sm = require("sitemap");

const readline = createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log("Hello!\nPlease enter the name of the site!");

const start = () => {
  readline.question("What is the complete URL of site?", site => {
    if (site == null || site.length == 0) {
      console.log("Please enter a URL");
      start();
    } else if (!site.includes("http")) {
      console.log(
        "Please include protocall in URL e.g. http://ect and not ect"
      );
      start();
    } else {
      middle(site);
    }
  });
};

start();

const middle = site => {
  let links = [];
  const printLinks = () => {
    console.log(`site: ${site}`);
    links.forEach((link, i) => console.log(`(${i}) ${link}`));
  };

  readline.question(
    "What are the main links? (e.g /home, /contact, ...)",
    link => {
      if (site == null || site.length == 0) {
        console.log("Please enter a link");
        middle();
      } else {
        links.push(link);
        printLinks();
        const moreYesOrNo = () => {
          readline.question("Are there more? Yes or No?", answer => {
            if (answer.toLowerCase().includes("no")) {
              readline.close();
              finish(site, links);
            } else if (answer.toLowerCase().includes("yes")) {
              readline.close();
              middle();
            } else {
              console.log("Sorry I didn't get that. Write 'Yes' or 'No'");
              readline.close();
              moreYesOrNo();
            }
          });
        };
        moreYesOrNo();
      }
    }
  );
};

const finish = (site, links) => {
  const sitemap = sm.createSitemap({
    hostname: site,
    urls: links.map(
      (link, i) =>
        new Object({
          url: link,
          changeFreq: "daily",
          priority: links.length - i / links.length
        })
    )
  });

  sitemap.toXML((err, data) => {
    if (err) {
      console.error(err);
      return;
    } else {
      console.log("Sitemap generated at sitemap.xml!");
      writeFileSync("sitemap.xml", data);
    }
  });
};
