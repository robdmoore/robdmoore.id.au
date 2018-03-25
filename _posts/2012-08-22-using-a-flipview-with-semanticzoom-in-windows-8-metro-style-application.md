---
id: 360
title: Using a FlipView with SemanticZoom in Windows 8 Metro-style application
date: 2012-08-22T13:15:27+00:00
author: rob
layout: post
guid: http://robdmoore.id.au/?p=360
permalink: /blog/2012/08/22/using-a-flipview-with-semanticzoom-in-windows-8-metro-style-application/
categories:
  - Technical
tags:
  - 'C#'
  - metro-style
  - modern ui
  - tech evangelism
  - windows 8
  - xaml
---
This post outlines how I managed to get a FlipView control working inside of a Semantic Zoom when developing a Windows 8 metro-style application using C# / XAML.

## An aside about XAML vs HTML for Windows 8 development

As anyone following me on Twitter would have seen I&#8217;ve found myself fortunate enough to be in a situation where I&#8217;m not only (finally) learning XAML, but also creating a Windows 8 &#8220;<a href="http://www.theverge.com/2012/8/10/3232921/microsoft-modern-ui-style-metro-style-replacement" target="_blank">metro-style</a>&#8221; proof-of-concept application.

While I come from a web background I was recommended to use C# XAML rather than HTML 5 to create the application. While creating the application I&#8217;ve come across a fair bit of documentation and sample applications using HTML 5 / JavaScript rather than XAML / C#. While I haven&#8217;t done any windows 8 apps in JavaScript yet, I suspect that using XAML is more powerful and expressive, even if it&#8217;s a little bit more verbose and slightly less convenient to style. Regardless, at this point that&#8217;s just pure conjecture on my part.

## What I wanted to achieve and why

Back to the point: One thing I wanted to demonstrate in my proof-of-concept application was the use of <a href="http://msdn.microsoft.com/en-us/library/windows/apps/hh465319.aspx" target="_blank">semantic zoom</a> because I think it&#8217;s a very powerful user interface concept and led quite naturally to provide that little bit more convenient and natural navigation to the application I was creating.

At the same time I wasÂ adamantÂ that I wanted to use a <a href="http://msdn.microsoft.com/en-us/library/windows/apps/hh850405.aspx" target="_blank">flip view</a> because I had a small number of discrete items that I wanted to each take up a page. While there is a concept of providing a <a href="http://msdn.microsoft.com/en-us/library/windows/apps/hh465425.aspx#creating_a_context_control" target="_blank">context indicator control</a> I wanted to also have an <a href="http://msdn.microsoft.com/en-US/library/windows/apps/xaml/Hh781231" target="_blank">app bar</a> and felt that the semantic zoom provided a cleaner way of providing that high level navigation (as well as there were few enough items in the list and they were always the same that the user always knew where they were so didn&#8217;t need any indication).

## The problem

SemanticZoom only allows you to use a GridView or ListView within it and while there are posts out there about how you can come up with custom controls <a href="http://code.msdn.microsoft.com/windowsapps/SemanticZoom-for-custom-4749edab" target="_blank">they only seem to apply to HTML / JavaScript</a> and not XAML.

As explained above I didn&#8217;t want aÂ continuouslyÂ scrolling control, I wanted to use the FlipView Control. Initially I tried this by nesting a FlipView directly inside a GridViewItem and a ListViewItem, but that looks really ugly because of the default hover, selection and click semantics on those controls. As well as that, the items weren&#8217;t being bounded to the parent and thus my content was being cut off.

## The solution

What I ended up doing was the following.

### MyView.xaml

<pre class="brush: xml; title: ; notranslate" title="">&lt;SemanticZoom&gt;
                &lt;SemanticZoom.ZoomedOutView&gt;
                    &lt;ListView HorizontalAlignment="Center" VerticalAlignment="Center"&gt;
                        &lt;ListView.ItemsPanel&gt;
                            &lt;ItemsPanelTemplate&gt;
                                &lt;StackPanel Orientation="Horizontal" /&gt;
                            &lt;/ItemsPanelTemplate&gt;
                        &lt;/ListView.ItemsPanel&gt;
                        &lt;ListViewItem Background="#E30000" Style="{StaticResource SemanticZoomListItem}" Tapped="Category1Selected"&gt;
                            &lt;Grid&gt;
                                &lt;TextBlock Text="Category1" Style="{StaticResource SemanticZoomListItemTitle}" /&gt;
                                &lt;Image Source="ms-appx:///Assets/Category1.png" Style="{StaticResource SemanticZoomListItemImage}" /&gt;
                            &lt;/Grid&gt;
                        &lt;/ListViewItem&gt;
                        &lt;ListViewItem Background="#FF6400" Style="{StaticResource SemanticZoomListItem}" Tapped="Category2Selected"&gt;
                            &lt;Grid&gt;
                                &lt;TextBlock Text="Category2" Style="{StaticResource SemanticZoomListItemTitle}" /&gt;
                                &lt;Image Source="ms-appx:///Assets/Category2.png" Style="{StaticResource SemanticZoomListItemImage}" /&gt;
                            &lt;/Grid&gt;
                        &lt;/ListViewItem&gt;
                        &lt;ListViewItem Background="#009600" Style="{StaticResource SemanticZoomListItem}" Tapped="Category3Selected"&gt;
                            &lt;Grid&gt;
                                &lt;TextBlock Text="Category3" Style="{StaticResource SemanticZoomListItemTitle}" /&gt;
                                &lt;Image Source="ms-appx:///Assets/Category3.png" Style="{StaticResource SemanticZoomListItemImage}" /&gt;
                            &lt;/Grid&gt;
                        &lt;/ListViewItem&gt;
                        &lt;ListViewItem Background="#006BE3" Style="{StaticResource SemanticZoomListItem}" Tapped="Category4Selected"&gt;
                            &lt;Grid&gt;
                                &lt;TextBlock Text="Category4" Style="{StaticResource SemanticZoomListItemTitle}" /&gt;
                                &lt;Image Source="ms-appx:///Assets/Category4.png" Style="{StaticResource SemanticZoomListItemImage}" /&gt;
                            &lt;/Grid&gt;
                        &lt;/ListViewItem&gt;
                    &lt;/ListView&gt;
                &lt;/SemanticZoom.ZoomedOutView&gt;
                &lt;SemanticZoom.ZoomedInView&gt;
                    &lt;GridView ScrollViewer.HorizontalScrollMode="Disabled" ScrollViewer.VerticalScrollMode="Disabled"  SelectionMode="None" IsItemClickEnabled="False" IsHoldingEnabled="False" IsSwipeEnabled="False" CanReorderItems="False" CanDragItems="False" ItemContainerStyle="{StaticResource ZenGridViewItemStyle}"&gt;
                        &lt;GridViewItem&gt;
                            &lt;FlipView x:Name="FlipParent"&gt;
                                &lt;FlipViewItem x:Name="Category1FlipView"&gt;
                                    &lt;Controls:Category1 /&gt;
                                &lt;/FlipViewItem&gt;
                                &lt;FlipViewItem x:Name="Category2FlipView"&gt;
                                    &lt;Controls:Category2 /&gt;
                                &lt;/FlipViewItem&gt;
                                &lt;FlipViewItem x:Name="Category3FlipView"&gt;
                                    &lt;Controls:Category3 /&gt;
                                &lt;/FlipViewItem&gt;
                                &lt;FlipViewItem x:Name="Category4FlipView"&gt;
                                    &lt;Controls:Category4 /&gt;
                                &lt;/FlipViewItem&gt;
                            &lt;/FlipView&gt;
                        &lt;/GridViewItem&gt;
                    &lt;/GridView&gt;
                &lt;/SemanticZoom.ZoomedInView&gt;
            &lt;/SemanticZoom&gt;
</pre>

### App.xaml

<pre class="brush: xml; title: ; notranslate" title="">&lt;ResourceDictionary.MergedDictionaries&gt;
                &lt;ResourceDictionary Source="Common/StandardStyles.xaml"/&gt;
                &lt;ResourceDictionary Source="Common/ZenStyles.xaml"/&gt;
            &lt;/ResourceDictionary.MergedDictionaries&gt;
...
            &lt;Style x:Key="SemanticZoomListItem" TargetType="ListViewItem"&gt;
                &lt;Setter Property="Padding" Value="4" /&gt;
                &lt;Setter Property="Width" Value="128" /&gt;
                &lt;Setter Property="Height" Value="128" /&gt;
                &lt;Setter Property="Margin" Value="0" /&gt;
                &lt;Setter Property="HorizontalContentAlignment" Value="Stretch" /&gt;
                &lt;Setter Property="VerticalContentAlignment" Value="Stretch" /&gt;
            &lt;/Style&gt;
            &lt;Style x:Key="SemanticZoomListItemTitle" TargetType="TextBlock" BasedOn="{StaticResource BasicTextStyle}"&gt;
                &lt;Setter Property="FontSize" Value="20" /&gt;
                &lt;Setter Property="FontWeight" Value="SemiLight" /&gt;
                &lt;Setter Property="HorizontalAlignment" Value="Left" /&gt;
                &lt;Setter Property="VerticalAlignment" Value="Bottom" /&gt;
            &lt;/Style&gt;
            &lt;Style x:Key="SemanticZoomListItemImage" TargetType="Image"&gt;
                &lt;Setter Property="HorizontalAlignment" Value="Center" /&gt;
                &lt;Setter Property="VerticalAlignment" Value="Center" /&gt;
                &lt;Setter Property="Width" Value="64" /&gt;
                &lt;Setter Property="Height" Value="64" /&gt;
            &lt;/Style&gt;
</pre>

### Common/ZenStyles.xaml

Copied from <a href="http://blogs.u2u.be/diederik/post/2012/07/09/The-taming-of-the-Metro-GridView.aspx" target="_blank">The taming of the Metro GridView</a>.

### MyView.xaml.cs

This bit is the bit I like the least and I&#8217;m sure there is a less verbose way of doing it, but I&#8217;m happy enough with it for now. This is to get around the fact that we aren&#8217;t using the ListView or GridView so we need to manually set the correct FlipViewItem to display when the top level category is selected. I&#8217;ll be honest this part is a bit of a hack, but hey &#8211; it works!

<pre class="brush: csharp; title: ; notranslate" title="">private void Category1Selected(object sender, TappedRoutedEventArgs e)
        {
            FlipParent.SelectedItem = Category1FlipView;
        }

        private void Category2Selected(object sender, TappedRoutedEventArgs e)
        {
            FlipParent.SelectedItem = Category2FlipView;
        }

        private void Category3Selected(object sender, TappedRoutedEventArgs e)
        {
            FlipParent.SelectedItem = Category3FlipView;
        }

        private void Category4Selected(object sender, TappedRoutedEventArgs e)
        {
            FlipParent.SelectedItem = Category4FlipView;
        }
</pre>

## Edit 27/08/2012: Changes needed for RTM

I just tried this out in RTM VS 2012 and Wind 8 SDK and noticed that it was broken. The fix was to change from the PointerReleased event to the Tapped event.