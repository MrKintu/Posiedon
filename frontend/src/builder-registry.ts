"use client"
import { builder, Builder, withChildren } from "@builder.io/react";
import AboutSectionOne from "./components/About/AboutSectionOne";
import AboutSectionTwo from "./components/About/AboutSectionTwo";
import Blog from "./components/Generic";
import Brands from "./components/Brands";
import Breadcrumb from "./components/Common/Breadcrumb";
import Button from "./components/Button";
import Cart from "./components/Cart";
import ChartsHeader from "./components/ChartsHeader";
import Chat from "./components/Chat";
import Contact from "./components/Contact";
import { ContextProvider } from "./contexts/ContextProvider";
import Counter from "./components/Counter/Counter";
import { EditorData, GridOrderImage } from "../public/data/dummy";
import Features from "./components/Features";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Hero from "./components/Hero";
import LineChart from "./components/Charts/LineChart";
import MyApp from "./app/_app";
import Navbar from "./components/Navbar";
import NewsLatterBox from "./components/Contact/NewsLatterBox";
import Notification from "./components/Notification";
import OfferList from "./components/Pricing/OfferList";
import Pie from "./components/Charts/Pie";
import Pricing from "./components/Pricing";
import PricingBox from "./components/Pricing/PricingBox";
import { Providers } from "./app/providers";
import RelatedPost from "./components/Generic/RelatedPost";
import ScrollToTop from "./components/ScrollToTop";
import SectionTitle from "./components/Common/SectionTitle";
import SettingIcon from "./components/SettingIcon";
import SharePost from "./components/Generic/SharePost";
import Sidebar from "./components/Sidebar";
import SingleBlog from "./components/Generic/SingleGeneric";
import SingleFeature from "./components/Features/SingleFeature";
import SingleTestimonial from "./components/Testimonials/SingleTestimonial";
import SparkLine from "./components/Charts/SparkLine";
import Stacked from "./components/Charts/Stacked";
import StackedChart from "./components/Charts/StackedChart";
import SubHeading from "./components/SubHeading";
import TagButton from "./components/Generic/TagButton";
import Testimonials from "./components/Testimonials";
import ThemeSettings from "./components/ThemeSettings";
import ThemeToggler from "./components/Navbar/ThemeToggler";
import ThemeWindow from "./components/ThemeWindow";
import Video from "./components/Video";

builder.init(process.env.NEXT_PUBLIC_BUILDER_API_KEY!);


Builder.registerComponent(Counter, {
    name: "Counter",
    inputs: [{
            name: "initialCount",
            type: "number"
        }]
});

Builder.registerComponent(AboutSectionOne, {
    name: "AboutSectionOne"
});

Builder.registerComponent(AboutSectionTwo, {
    name: "AboutSectionTwo"
});

Builder.registerComponent(Blog, {
    name: "Blog"
});

Builder.registerComponent(Brands, {
    name: "Brands"
});

Builder.registerComponent(Breadcrumb, {
    name: "Breadcrumb",
    inputs: [{
            name: "description",
            type: "string",
            required: true
        }, {
            name: "pageName",
            type: "string",
            required: true
        }]
});

Builder.registerComponent(Contact, {
    name: "Contact"
});

Builder.registerComponent(Features, {
    name: "Features"
});

Builder.registerComponent(Footer, {
    name: "Footer"
});

Builder.registerComponent(Hero, {
    name: "Hero"
});

Builder.registerComponent(NewsLatterBox, {
    name: "NewsLatterBox"
});

Builder.registerComponent(OfferList, {
    name: "OfferList",
    inputs: [{
            name: "status",
            type: "string",
            enum: [
                "active",
                "inactive"
            ],
            required: true
        }, {
            name: "text",
            type: "string",
            required: true
        }]
});

Builder.registerComponent(Pricing, {
    name: "Pricing"
});

Builder.registerComponent(withChildren(PricingBox), {
    name: "PricingBox",
    inputs: [{
            name: "children",
            type: "string",
            hideFromUI: true,
            meta: {
                ts: "ReactNode"
            }
        }, {
            name: "duration",
            type: "string",
            required: true
        }, {
            name: "packageName",
            type: "string",
            required: true
        }, {
            name: "price",
            type: "string",
            required: true
        }, {
            name: "subtitle",
            type: "string",
            required: true
        }]
});

Builder.registerComponent(withChildren(Providers), {
    name: "Providers",
    inputs: [{
            name: "children",
            type: "string",
            hideFromUI: true,
            meta: {
                ts: "ReactNode"
            }
        }]
});

Builder.registerComponent(RelatedPost, {
    name: "RelatedPost",
    inputs: [{
            name: "date",
            type: "string",
            required: true
        }, {
            name: "image",
            type: "string",
            required: true
        }, {
            name: "slug",
            type: "string",
            required: true
        }, {
            name: "title",
            type: "string",
            required: true
        }]
});

Builder.registerComponent(ScrollToTop, {
    name: "ScrollToTop"
});

Builder.registerComponent(SectionTitle, {
    name: "SectionTitle",
    inputs: [{
            name: "center",
            type: "boolean"
        }, {
            name: "mb",
            type: "string"
        }, {
            name: "paragraph",
            type: "string",
            required: true
        }, {
            name: "title",
            type: "string",
            required: true
        }, {
            name: "width",
            type: "string"
        }]
});

Builder.registerComponent(SharePost, {
    name: "SharePost"
});

Builder.registerComponent(SingleBlog, {
    name: "SingleBlog",
    inputs: [{
            name: "blog",
            type: "object",
            hideFromUI: true,
            meta: {
                ts: "Blog"
            },
            required: true
        }]
});

Builder.registerComponent(SingleFeature, {
    name: "SingleFeature",
    inputs: [{
            name: "feature",
            type: "object",
            hideFromUI: true,
            meta: {
                ts: "Feature"
            },
            required: true
        }]
});

Builder.registerComponent(SingleTestimonial, {
    name: "SingleTestimonial",
    inputs: [{
            name: "testimonial",
            type: "object",
            hideFromUI: true,
            meta: {
                ts: "Testimonial"
            },
            required: true
        }]
});

Builder.registerComponent(TagButton, {
    name: "TagButton",
    inputs: [{
            name: "href",
            type: "string"
        }, {
            name: "text",
            type: "string",
            required: true
        }]
});

Builder.registerComponent(Testimonials, {
    name: "Testimonials"
});

Builder.registerComponent(Video, {
    name: "Video"
});

Builder.registerComponent(Button, {
    name: "Button"
});

Builder.registerComponent(Cart, {
    name: "Cart"
});

Builder.registerComponent(ChartsHeader, {
    name: "ChartsHeader"
});

Builder.registerComponent(Chat, {
    name: "Chat"
});

Builder.registerComponent(withChildren(ContextProvider), {
    name: "ContextProvider",
    inputs: [{
            name: "children",
            type: "string",
            hideFromUI: true,
            meta: {
                ts: "ReactNode"
            }
        }]
});

Builder.registerComponent(EditorData, {
    name: "EditorData"
});

Builder.registerComponent(GridOrderImage, {
    name: "GridOrderImage",
    inputs: [{
            name: "ProductImage",
            type: "string",
            required: true
        }]
});

Builder.registerComponent(LineChart, {
    name: "LineChart"
});

Builder.registerComponent(MyApp, {
    name: "MyApp"
});

Builder.registerComponent(Navbar, {
    name: "Navbar"
});

Builder.registerComponent(Header, {
    name: "Header",
    inputs: [{
            name: "category",
            type: "string",
            required: true
        }, {
            name: "title",
            type: "string",
            required: true
        }]
});

Builder.registerComponent(Notification, {
    name: "Notification"
});

Builder.registerComponent(Pie, {
    name: "Pie"
});

Builder.registerComponent(SettingIcon, {
    name: "SettingIcon"
});

Builder.registerComponent(Sidebar, {
    name: "Sidebar"
});

Builder.registerComponent(SparkLine, {
    name: "SparkLine",
    inputs: [{
            name: "color",
            type: "string",
            required: true
        }, {
            name: "currentColor",
            type: "string",
            required: true
        }, {
            name: "data",
            type: "object",
            hideFromUI: true,
            meta: {
                ts: "{ x: string | number; yval: number; }[]"
            },
            required: true
        }, {
            name: "height",
            type: "string",
            required: true
        }, {
            name: "id",
            type: "string",
            required: true
        }, {
            name: "type",
            type: "string",
            enum: [
                "Area",
                "Column",
                "Line",
                "WinLoss"
            ],
            required: true
        }, {
            name: "width",
            type: "string",
            required: true
        }]
});

Builder.registerComponent(Stacked, {
    name: "Stacked",
    inputs: [{
            name: "height",
            type: "string",
            required: true
        }, {
            name: "width",
            type: "string",
            required: true
        }]
});

Builder.registerComponent(StackedChart, {
    name: "StackedChart",
    inputs: [{
            name: "height",
            type: "string",
            required: true
        }, {
            name: "width",
            type: "string",
            required: true
        }]
});

Builder.registerComponent(SubHeading, {
    name: "SubHeading",
    inputs: [{
            name: "func",
            type: "object",
            hideFromUI: true,
            meta: {
                ts: "() => void"
            },
            required: true
        }, {
            name: "secText",
            type: "string"
        }, {
            name: "text",
            type: "string",
            required: true
        }]
});

Builder.registerComponent(ThemeSettings, {
    name: "ThemeSettings"
});

Builder.registerComponent(ThemeToggler, {
    name: "ThemeToggler"
});

Builder.registerComponent(ThemeWindow, {
    name: "ThemeWindow"
});

Builder.registerComponent(Notification, {
    name: "Notification"
});
