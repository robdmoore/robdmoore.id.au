---
id: 368
title: Using an X.509 (pfx) certificate in Windows 8 Metro-style application for encryption, decryption and signing
date: 2012-08-22T13:34:04+00:00
author: rob
layout: post
guid: http://robdmoore.id.au/?p=368
permalink: /blog/2012/08/22/using-an-x-509-pfx-certificate-in-windows-8-metro-style-application-for-encryption-decryption-and-signing/
categories:
  - Technical
tags:
  - 'C#'
  - cryptography
  - metro-style
  - windows 8
  - winrt
  - xaml
---
One of the things that you need to live with if you are creating a metro-style application is that you are in a sandbox and consequently you don&#8217;t have the full .NET runtime available to you. Thus, when I wanted to do some signing using a pfx certificate in my Windows 8 application I was sad, but not surprised to see that the awesome <a href="http://msdn.microsoft.com/en-us/library/system.security.aspx" target="_blank">System.Security</a> namespace isn&#8217;t available. Instead you need to deal with the <a href="http://msdn.microsoft.com/en-us/library/windows/apps/windows.security.cryptography.core" target="_blank">Windows.Security</a> namespace, which is a cut-down set of cryptographic functionality with a completely different API to what you might be used to!

Most of the code samples I could find were demonstrating how to create a new public/private keypair and then use that to perform the signing etc., but that wasn&#8217;t useful for me in this instance because I wanted to use a private key we already had (and trusted).

The trick of course was to try and load our certificate in, and looking through all of the classes and methods in the namespace it wasn&#8217;t immediately clear how to do that. I originally tried using the <a href="http://msdn.microsoft.com/en-us/library/windows/apps/windows.security.cryptography.certificates.certificateenrollmentmanager.importpfxdataasync" target="_blank">CertificateEnrollmentManager.ImportPfxDataAsync</a> method, but apart from the fact I wasn&#8217;t able to figure out how to get my pfx file data into a format that method would select I eventually realised this wouldn&#8217;t help me. This method imports the certificate into the sandboxed certificate store the app has, but this isn&#8217;t helpful because:

  1. There is no way to use the certificates in the store programmatically
  2. I managed to figure out the store is just for using HTTP client certificates rather than as a general certificate store

## The solution

Firstly you need to grab your pfx and convert it to CSP format (I did this in LinqPad):

<pre class="brush: csharp; title: ; notranslate" title="">var cert = new System.Security.Cryptography.X509Certificates.X509Certificate2(@"c:pathtomypfx_file.pfx", "password", System.Security.Cryptography.X509Certificates.X509KeyStorageFlags.Exportable);
var privateKey = cert.PrivateKey as System.Security.Cryptography.RSACryptoServiceProvider;
var cspBlob = privateKey.ExportCspBlob(true);
Console.WriteLine(Convert.ToBase64String(cspBlob));
</pre>

Then put the resultant text in a .txt file in your metro app and mark the file as content and the following code should work (this example for signing, but the same applies for using the CryptographicEngine to decrypt, encrypt etc.):

<pre class="brush: csharp; title: ; notranslate" title="">public async Task&lt;IBuffer&gt; Sign(IBuffer toSign)
    {
        var file = await (StorageFile.GetFileFromApplicationUriAsync(new Uri("ms-appx:///path/to/my/csp_key.txt")));
        var contents = await FileIO.ReadBufferAsync(file);
        var contentsAsArray = contents.ToArray();
        var base64Contents = Encoding.UTF8.GetString(contentsAsArray.ToArray(), 0, contentsAsArray.ToArray().Length);

        var algorithm = AsymmetricKeyAlgorithmProvider.OpenAlgorithm(AsymmetricAlgorithmNames.RsaSignPkcs1Sha1);
        var key = algorithm.ImportKeyPair(Convert.FromBase64String(base64Contents).AsBuffer(), CryptographicPrivateKeyBlobType.Capi1PrivateKey);

        return CryptographicEngine.Sign(key, toSign);
    }
</pre>

If doing this you should note that you are storing the private key in a non-encrypted form inside your app package, which isn&#8217;t secure if you don&#8217;t trust the machine that the app will be deployed to.