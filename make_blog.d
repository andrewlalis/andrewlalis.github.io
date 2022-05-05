#!/usr/bin/env dub
/+ dub.sdl:
    dependency "dsh" version="~>1.6.1"
+/
import dsh;
import std.path;
import std.format;

/** 
 * Generates a new blog article page with some basic information set.
 */
void main() {
    import std.string;
    writeln("What is the title of the article?");
    string title = readln().strip;
    writeln("What is the description of the article?");
    string description = readln().strip;
    string filename = format("%03d_%s.html", getNextBlogNumber(), cleanTitle(title));
    string tpl = readText("pages/blogs/template.html")
        .replacePlaceholder("TEMPLATE_TITLE", title)
        .replacePlaceholder("TEMPLATE_DESCRIPTION", description)
        .replacePlaceholder("TEMPLATE_TIME", getTimeString());
    std.file.write(buildPath("pages/blogs", filename), tpl);
    print("Created new blog article %s.", filename);
}

int getNextBlogNumber() {
    import std.algorithm;
    import std.conv;
    return findFiles("pages/blogs/", "^\\d{3}_.*\\.html")
        .map!(file => baseName(file)[0 .. 3].to!int)
        .maxElement + 1;
}

string getTimeString() {
    import std.datetime.systime;
    SysTime currentTime = Clock.currTime();
    int day = currentTime.day();
    int month = currentTime.month();
    int year = currentTime.year();
    const months = [
        "January", "February", "March",
        "April", "May", "June",
        "July", "August", "September",
        "October", "November", "December"
    ];
    return format("%d %s, %d", day, months[month - 1], year);
}

string cleanTitle(string s) {
    import std.uni;
    s = s.replaceAll("\\s+", "_");
    s = s.toLower();
    return s;
}

string replacePlaceholder(string tpl, string name, string value) {
    return tpl.replaceAll("\\{\\{" ~ name ~ "\\}\\}", value);
}
