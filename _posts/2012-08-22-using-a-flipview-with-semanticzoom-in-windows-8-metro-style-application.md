---
layout: post
title: Using a FlipView with SemanticZoom in Windows 8 Metro-style application
date: 2012-08-22 13:15:27.000000000 +08:00
type: post
categories:
- Technical
tags:
- C#
- metro-style
- modern ui
- tech evangelism
- windows 8
- xaml
author: rob
---


This post outlines how I managed to get a FlipView control working inside of a Semantic Zoom when developing a Windows 8 metro-style application using C# / XAML.


## An aside about XAML vs HTML for Windows 8 development


As anyone following me on Twitter would have seen I've found myself fortunate enough to be in a situation where I'm not only (finally) learning XAML, but also creating a Windows 8 "[metro-style](http://www.theverge.com/2012/8/10/3232921/microsoft-modern-ui-style-metro-style-replacement)" proof-of-concept application.



While I come from a web background I was recommended to use C# XAML rather than HTML 5 to create the application. While creating the application I've come across a fair bit of documentation and sample applications using HTML 5 / JavaScript rather than XAML / C#. While I haven't done any windows 8 apps in JavaScript yet, I suspect that using XAML is more powerful and expressive, even if it's a little bit more verbose and slightly less convenient to style. Regardless, at this point that's just pure conjecture on my part.


## What I wanted to achieve and why


Back to the point: One thing I wanted to demonstrate in my proof-of-concept application was the use of [semantic zoom](http://msdn.microsoft.com/en-us/library/windows/apps/hh465319.aspx) because I think it's a very powerful user interface concept and led quite naturally to provide that little bit more convenient and natural navigation to the application I was creating.



At the same time I was adamant that I wanted to use a [flip view](http://msdn.microsoft.com/en-us/library/windows/apps/hh850405.aspx) because I had a small number of discrete items that I wanted to each take up a page. While there is a concept of providing a [context indicator control](http://msdn.microsoft.com/en-us/library/windows/apps/hh465425.aspx#creating_a_context_control) I wanted to also have an [app bar](http://msdn.microsoft.com/en-US/library/windows/apps/xaml/Hh781231) and felt that the semantic zoom provided a cleaner way of providing that high level navigation (as well as there were few enough items in the list and they were always the same that the user always knew where they were so didn't need any indication).


## The problem


SemanticZoom only allows you to use a GridView or ListView within it and while there are posts out there about how you can come up with custom controls [they only seem to apply to HTML / JavaScript](http://code.msdn.microsoft.com/windowsapps/SemanticZoom-for-custom-4749edab) and not XAML.



As explained above I didn't want a continuously scrolling control, I wanted to use the FlipView Control. Initially I tried this by nesting a FlipView directly inside a GridViewItem and a ListViewItem, but that looks really ugly because of the default hover, selection and click semantics on those controls. As well as that, the items weren't being bounded to the parent and thus my content was being cut off.


## The solution


What I ended up doing was the following.


### MyView.xaml


```xml
            <SemanticZoom>
                <SemanticZoom.ZoomedOutView>
                    <ListView HorizontalAlignment="Center" VerticalAlignment="Center">
                        <ListView.ItemsPanel>
                            <ItemsPanelTemplate>
                                <StackPanel Orientation="Horizontal" />
                            </ItemsPanelTemplate>
                        </ListView.ItemsPanel>
                        <ListViewItem Background="#E30000" Style="{StaticResource SemanticZoomListItem}" Tapped="Category1Selected">
                            <Grid>
                                <TextBlock Text="Category1" Style="{StaticResource SemanticZoomListItemTitle}" />
                                <Image Source="ms-appx:///Assets/Category1.png" Style="{StaticResource SemanticZoomListItemImage}" />
                            </Grid>
                        </ListViewItem>
                        <ListViewItem Background="#FF6400" Style="{StaticResource SemanticZoomListItem}" Tapped="Category2Selected">
                            <Grid>
                                <TextBlock Text="Category2" Style="{StaticResource SemanticZoomListItemTitle}" />
                                <Image Source="ms-appx:///Assets/Category2.png" Style="{StaticResource SemanticZoomListItemImage}" />
                            </Grid>
                        </ListViewItem>
                        <ListViewItem Background="#009600" Style="{StaticResource SemanticZoomListItem}" Tapped="Category3Selected">
                            <Grid>
                                <TextBlock Text="Category3" Style="{StaticResource SemanticZoomListItemTitle}" />
                                <Image Source="ms-appx:///Assets/Category3.png" Style="{StaticResource SemanticZoomListItemImage}" />
                            </Grid>
                        </ListViewItem>
                        <ListViewItem Background="#006BE3" Style="{StaticResource SemanticZoomListItem}" Tapped="Category4Selected">
                            <Grid>
                                <TextBlock Text="Category4" Style="{StaticResource SemanticZoomListItemTitle}" />
                                <Image Source="ms-appx:///Assets/Category4.png" Style="{StaticResource SemanticZoomListItemImage}" />
                            </Grid>
                        </ListViewItem>
                    </ListView>
                </SemanticZoom.ZoomedOutView>
                <SemanticZoom.ZoomedInView>
                    <GridView ScrollViewer.HorizontalScrollMode="Disabled" ScrollViewer.VerticalScrollMode="Disabled"  SelectionMode="None" IsItemClickEnabled="False" IsHoldingEnabled="False" IsSwipeEnabled="False" CanReorderItems="False" CanDragItems="False" ItemContainerStyle="{StaticResource ZenGridViewItemStyle}">
                        <GridViewItem>
                            <FlipView x:Name="FlipParent">
                                <FlipViewItem x:Name="Category1FlipView">
                                    <Controls:Category1 />
                                </FlipViewItem>
                                <FlipViewItem x:Name="Category2FlipView">
                                    <Controls:Category2 />
                                </FlipViewItem>
                                <FlipViewItem x:Name="Category3FlipView">
                                    <Controls:Category3 />
                                </FlipViewItem>
                                <FlipViewItem x:Name="Category4FlipView">
                                    <Controls:Category4 />
                                </FlipViewItem>
                            </FlipView>
                        </GridViewItem>
                    </GridView>
                </SemanticZoom.ZoomedInView>
            </SemanticZoom>
```


### App.xaml


```xml
            <ResourceDictionary.MergedDictionaries>
                <ResourceDictionary Source="Common/StandardStyles.xaml"/>
                <ResourceDictionary Source="Common/ZenStyles.xaml"/>
            </ResourceDictionary.MergedDictionaries>
...
            <Style x:Key="SemanticZoomListItem" TargetType="ListViewItem">
                <Setter Property="Padding" Value="4" />
                <Setter Property="Width" Value="128" />
                <Setter Property="Height" Value="128" />
                <Setter Property="Margin" Value="0" />
                <Setter Property="HorizontalContentAlignment" Value="Stretch" />
                <Setter Property="VerticalContentAlignment" Value="Stretch" />
            </Style>
            <Style x:Key="SemanticZoomListItemTitle" TargetType="TextBlock" BasedOn="{StaticResource BasicTextStyle}">
                <Setter Property="FontSize" Value="20" />
                <Setter Property="FontWeight" Value="SemiLight" />
                <Setter Property="HorizontalAlignment" Value="Left" />
                <Setter Property="VerticalAlignment" Value="Bottom" />
            </Style>
            <Style x:Key="SemanticZoomListItemImage" TargetType="Image">
                <Setter Property="HorizontalAlignment" Value="Center" />
                <Setter Property="VerticalAlignment" Value="Center" />
                <Setter Property="Width" Value="64" />
                <Setter Property="Height" Value="64" />
            </Style>
```


### Common/ZenStyles.xaml


Copied from [The taming of the Metro GridView](http://blogs.u2u.be/diederik/post/2012/07/09/The-taming-of-the-Metro-GridView.aspx).


### MyView.xaml.cs


This bit is the bit I like the least and I'm sure there is a less verbose way of doing it, but I'm happy enough with it for now. This is to get around the fact that we aren't using the ListView or GridView so we need to manually set the correct FlipViewItem to display when the top level category is selected. I'll be honest this part is a bit of a hack, but hey - it works!



```csharp
        private void Category1Selected(object sender, TappedRoutedEventArgs e)
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
```


## Edit 27/08/2012: Changes needed for RTM


I just tried this out in RTM VS 2012 and Wind 8 SDK and noticed that it was broken. The fix was to change from the PointerReleased event to the Tapped event.

