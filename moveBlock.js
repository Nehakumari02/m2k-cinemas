const fs = require('fs');
const content = fs.readFileSync('client/src/pages/Public/BookingPage/BookingPage.js', 'utf8');

const regex = /\n\s*\{\(castMembers\.length \|\| crewMembers\.length \|\| backdropImages\.length\) && \(\n\s*<div style=\{\{ marginTop: 32, marginBottom: 8 \}\}>[\s\S]*?\n\s*<\/div>\n\s*\)\}\n/;

const match = content.match(regex);
if(match) {
    let newContent = content.replace(match[0], '\n');
    const insertPoint = /\/>\n\s*\{showInvitation && !!selectedSeats\.length && \(/;
    newContent = newContent.replace(insertPoint, '/>' + match[0] + '            {showInvitation && !!selectedSeats.length && (');
    fs.writeFileSync('client/src/pages/Public/BookingPage/BookingPage.js', newContent);
    console.log("Success");
} else {
    console.log("Not found");
}
