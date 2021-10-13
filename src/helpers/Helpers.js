// import moment from "moment";

   export const formatDate = (date) => {
        // return moment(date).fromNow();
   }

    export const shortenText = (string, length) => {
        if (string.length > length && string.length > 0) {
            let newString = string + "";
            newString = string.substr(0, length);
            newString = string.substr(0, newString.lastIndexOf(" "));
            newString = newString.length > 0 ? newString : string.substr(0, length);
            return newString + "...";
        }
        return string;
    }

    export const stripHtmlTags = (input) => {
        return input.replace(/<(?:.|\n)*?>/gm, "");
    }
